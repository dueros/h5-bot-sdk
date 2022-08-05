import {
    createIframe,
    encodeObjectDataToUrlData,
    parseH5UrlOrigin,
    parseIntentSlots,
    postMessageToIframe,
    throttleFactory
} from "./utils";

/**
 * @file 游戏试玩
 * @description 游戏试玩付费相关处理逻辑
 * @author dengxuening<dengxuening@baidu.com>
 */

const TrialGameAction = {
    CANCEL_PAY: 'cancel_pay',
    GO_PAY: 'go_pay',
    GO_SCRIBE: 'go_scribe',
    CLOSE_BANNER: 'close_banner',
    REFRESH_BANNER_TEXT: 'refresh_banner_text', // 刷新试玩游戏订阅付费banner的文案
    REFRESH_ORDER_PARAMS: 'refresh_order_params' // 更新订单阻断页相关字段
};

/**
 * 游戏试玩付费相关逻辑
 */
export default class TrialGame {
    constructor(botApp) {
        this.botSDK = botApp;
        this.config = botApp.config;

        // 游戏进度心跳定时器
        this._gameBeatReportTimer = null;

        // 游戏试玩支付相关iframe
        this._trialGameOrderIframeDOM = null;

        // 游戏订阅banner
        this._trialGameBannerDOM = null;

        // 游戏试玩付费弹窗的iframe地址
        // URL参数需要额外传递
        this._trialGameOrderIframeUrl = 'https://xiaodu.baidu.com/saiya/sdk/iframe/trial-game-order.html';

        // 试玩游戏相关Iframe的用于postMessage的origin
        this._trialGameMsgTarget = parseH5UrlOrigin(this._trialGameOrderIframeUrl);

        // 试玩游戏的订阅链接
        this._trialGameSubscribeLink = null;

        // 是否需要用户点击的时候上报指定LinkClick
        this._needReportClickEvent = false;

        // 用户点击屏幕上报的linkClick
        this._gameScreenClickEvent = null;
    }

    handleIntent(payload) {
        const slots = payload.intent.slots;
        const intentName = payload.intent.name;
        const slotsMap = parseIntentSlots(slots);
        if (intentName === 'H5gameHeartBeatReport') {
            const customData = payload.customData
                ? JSON.parse(payload.customData)
                : null;
            this._handleH5gameHeartBeatReport(slotsMap, customData);
        } else if (intentName === 'H5gameTrialStatus') {
            const customData = payload.customData
                ? JSON.parse(payload.customData)
                : null;
            this._handleH5gameTrialStatus(slotsMap, customData);
        } else if (intentName === 'NotifyBuyStatus') {
            this._handleNotifyBuyStatus(slotsMap);
        }
    }

    /**
     * 处理游戏试玩付费相关iframe发过来的消息
     *
     * @param event
     */
    handleIframePostMessage(event) {
        const data = event.data;
        if (data.type === TrialGameAction.CANCEL_PAY) {
            this.botSDK.requestClose();
        } else if (data.type === TrialGameAction.GO_PAY) {
            this.botSDK.uploadLinkClicked({
                url: data.data.buyUrl,
            });
        } else if (data.type === TrialGameAction.CLOSE_BANNER) {
            this._closeTrialGameBanner();
        } else if (data.type === TrialGameAction.GO_SCRIBE) {
            if (this._trialGameSubscribeLink) {
                this.botSDK.uploadLinkClicked({
                    url: this._trialGameSubscribeLink,
                });
            } else {
                console.error('订阅游戏失败，没有linkClick地址');
            }
        }
    }

    /**
     * 处理是否进行心跳上报，是否展示付费提醒banner
     *
     * @param slotsMap
     * @private
     */
    _handleH5gameHeartBeatReport(slotsMap, customData) {
        let needReportGameBeat = false;
        let gameReportInterval = 60;
        if (slotsMap.has('needHeartbeatReport')) {
            if (Number(slotsMap.get('needHeartbeatReport')) === 1) {
                needReportGameBeat = true;
            }
        }
        if (slotsMap.has('timeInterval')) {
            gameReportInterval = Number(slotsMap.get('timeInterval'));
        }
        if (slotsMap.has('displaySub')) {
            if (Number(slotsMap.get('displaySub')) === 1) {
                const {desc, subUrl} = customData;
                // 这里存起来订阅游戏的linkClick
                this._trialGameSubscribeLink = subUrl;
                this._renderTrialGameSubscribeBanner({desc});
            }
        }
        if (slotsMap.has('needReportClickEvent')) {
            if (Number(slotsMap.has('needReportClickEvent')) === 1) {
                this._needReportClickEvent = true;
                this._gameScreenClickEvent = slotsMap.get('gameScreenClickEvent') || null;

                // 防止重复绑定
                window.removeEventListener('touchstart', this._fireScreenClicked, true);
                window.addEventListener('touchstart', this._fireScreenClicked, true);
            } else {
                this._needReportClickEvent = false;
                window.removeEventListener('touchstart', this._fireScreenClicked, true);
            }
        }
        if (needReportGameBeat) {
            this._fireGameProcessBeatReport(gameReportInterval);
        } else {
            this._cancelGameProcessBeatReport();
        }
    }

    /**
     * 处理试玩游戏的购买
     *
     * @param slotsMap
     * @param productData
     * @private
     */
    _handleH5gameTrialStatus(slotsMap, productData) {
        // productData的参数形式：{"payPrice": "支付价格",
        // "image": "展示图片", "video": "展示视频",
        // "productId": "商品id", "sellerOrderId":
        // "订单id", "buyUrl": "支付链接"}
        if (slotsMap.has('needPay')
            && (Number(slotsMap.get('needPay')) === 1)
            && productData
        ) {
            // 当为0元购时，直接触发付款二维码
            // http://wiki.baidu.com/pages/viewpage.action?pageId=1264960061
            if (Number(productData.payType) === 3) {

                // 本属性仅用于0元购相关
                this._buyUrl = productData.relatedProduct[0].buyUrl;
                this._firePayDialog();

                // 在0元购模式下，由于没有阻断页，用户从二维码付款页面返回后
                // 还能继续玩游戏为了组织用户继续游戏当用户触摸屏幕时
                // 再次进入付款二维码页面从而组织用户继续游戏
                window.addEventListener('touchstart', this._firePayDialog, true);
            } else {
                // 展示付费阻断页
                this._renderTrialGameOrder(productData)
            }
        }
        if (productData && productData.desc) {
            // 用于刷新订阅Banner的文案，一般用于动态更新试玩时间倒计时
            this._tryPostMessageToTrialGameSubscribeBanner({
                type: TrialGameAction.REFRESH_BANNER_TEXT,
                data: productData.desc
            });
        }
    }

    /**
     * 购买结果回调
     *
     * @param slotsMap
     * @private
     */
    _handleNotifyBuyStatus(slotsMap) {
        let purchaseResult = null;
        if (slotsMap.has('purchaseResult')) {
            purchaseResult = slotsMap.get('purchaseResult');
        }
        if (purchaseResult === 'SUCCESS') {
            this._closeTrialGameOrder();
            this._closeTrialGameBanner();
            window.removeEventListener('touchstart', this._firePayDialog, true);
        }
    }

    _firePayDialog = () => {
        this.botSDK.uploadLinkClicked({
            url: this._buyUrl,
            initiator: {
                type: 'AUTO_TRIGGER'
            }
        });
    }

    _fireScreenClicked = throttleFactory(() => {
        this.botSDK.uploadLinkClicked({
            url: this._gameScreenClickEvent
        });
    }, 3000);

    /**
     * 展示试玩H5游戏购买相关内容
     * @param data
     * @private
     */
    _renderTrialGameOrder(data) {
        // 避免重复创建
        if (this._trialGameOrderIframeDOM) {
            return;
        }
        console.log('game data', data);
        let payType = Number(data.payType);
        let iframeBackGround = '';
        let url = this._trialGameOrderIframeUrl;
        // 如果是单品付费
        if (payType === 1) {
            iframeBackGround = 'rgba(0, 0, 0, 0.3)';
        } else {
            iframeBackGround = 'transparent';
            url += '#/subscribeV2';
        }

        this._trialGameOrderIframeDOM = createIframe({
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            scrolling: 'yes',
            zIndex: this.config.orderZIndex,
            background: iframeBackGround
        });
        this._trialGameOrderIframeDOM.src = url;
        document.body.appendChild(this._trialGameOrderIframeDOM);
        this._tryPostMessageToTrialGameOrder({
            relatedProduct: data.relatedProduct,
            botId: this.config.skillID
        });
    }
    /**
     * 渲染订阅的banner
     * @param linkClick 订阅的linkClick
     * @private
     */
    _renderTrialGameSubscribeBanner({desc}) {
        // 避免重复创建
        if (this._trialGameBannerDOM) {
            return;
        }
        let dataParams = encodeObjectDataToUrlData({
            desc
        });
        let url = `${this._trialGameOrderIframeUrl}?${dataParams}#/banner`;
        this._trialGameBannerDOM = createIframe({
            left: '0',
            bottom: '0',
            width: '100%',
            height: '80px',
            zIndex: this.config.orderZIndex,
            background: 'transparent'
        });
        this._trialGameBannerDOM.src = url;
        document.body.appendChild(this._trialGameBannerDOM);
    }

    // 尝试向试玩游戏的订阅banner发送消息
    _tryPostMessageToTrialGameSubscribeBanner(data) {
        postMessageToIframe(this._trialGameBannerDOM, this._trialGameMsgTarget, data);
    }

    // 向游戏付费的阻断页发送消息
    _tryPostMessageToTrialGameOrder(data) {
        postMessageToIframe(this._trialGameOrderIframeDOM, this._trialGameMsgTarget, data);
    }

    /**
     * 试玩游戏购买成功后关闭订单页面
     * @private
     */
    _closeTrialGameOrder() {
        if (this._trialGameOrderIframeDOM) {
            document.body.removeChild(this._trialGameOrderIframeDOM);
            this._trialGameOrderIframeDOM = null;
        }
    }

    /**
     * 试玩游戏购买成功后关闭提示订阅的banner
     * @private
     */
    _closeTrialGameBanner() {
        if (this._trialGameBannerDOM) {
            document.body.removeChild(this._trialGameBannerDOM);
            this._trialGameBannerDOM = null;
        }
    }

    /**
     * 上报游戏心跳
     * @private
     */
    _reportGameBeat() {
        this.botSDK.uploadLinkClicked({
            url: `dueros://${this.config.skillID}/h5game/heartbeatreport`,
            initiator: {
                type: 'AUTO_TRIGGER'
            }
        });
    }

    /**
     * 游戏进度心跳上报
     * @param {number} interval 上报间隔，单位m
     * @private
     */
    _fireGameProcessBeatReport(interval = 60) {
        // 先立刻上报一次游戏心跳
        this._reportGameBeat();
        clearInterval(this._gameBeatReportTimer);
        this._gameBeatReportTimer = setInterval(() => {
            this._reportGameBeat();
        }, interval * 1000)
    }

    _cancelGameProcessBeatReport() {
        clearInterval(this._gameBeatReportTimer);
    }

}
