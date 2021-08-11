import {createIframe, isSet, parseH5UrlOrigin} from "./utils";

/**
 * @file 广告相关
 * @description 广告相关实现，但是目前广告还未上线
 * @author dengxuening<dengxuening@baidu.com>
 */

export default class Ad {
    constructor(botApp) {
        this.config = botApp.config;
        this.botSDK = botApp;

        // session期间最多弹出广告2次
        this._commonAdShowTimes = 2;

        // 广告弹出后，每次切换间隔10s
        this._commonadSwitchInterval = 10000;

        // 广告关闭后，下次打开在60s后
        this._commonAdReopenTimeout = 60000;

        // 广告iframe baseUrl
        this._adIframe1BaseUrl = '';

        this._isAdInit = false;

        // 是否手动关闭广告
        this._isCommonAdSwitchOff = false;

        // 广告是否正在展示
        this._isCommonAdDisplaying = false;
    }

    /**
     * 初始化广告
     * @param {Object} config 广告配置
     * @param {number} config.adZIndex 选填，默认值：9999，广告等浮层的层级，
     * @param {boolean} config.adDisable 选填，默认值：false，是否禁用广告
     * @param {enum} config.screenOrientation 选填，默认值：portrait，枚举值，游戏的屏幕类型，portrait => 竖屏，landscape => 全屏
     * @param {enum} config.displayStrategy 选填，默认值：twice，广告展示策略，once => 用户关闭后不再填充广告， twice => 用户关闭后再填充一次
     * @param {number} config.firstDisplayTime 选填，单位秒，广告第一次展示在游戏打开后多久
     * @param {Object} config.bannerPosition 选填，调整banner广告在游戏页面中的位置。值为CSS中的left、top、right、bottom，例如：bannerPosition: {left: '20px', top: '20px'}
     * @param {string} config.placeId 必填，广告位ID。
     * @param {Function} config.clickCallback 选填，广告点击时的回调函数
     * @param {Function} config.closeCallback 选填，广告关闭时的回调函数
     * @param {Function} config.displayCallback 选填，广告展示时的回调函数
     * @param {Function} config.switchCallback 选填，广告切换时的回调函数
     * @param {string} config._duerosDebugadIframeUrl 选填，内部使用，设置广告iframe的URL地址
     */
    initAd(config = {}) {
        if (this._isAdInit) {
            throw new Error('`initAd` can only be called once ');
        }
        this.config = {
            ...this.config,
            adZIndex: config.zIndex || 9999,
            screenOrientation: config.screenOrientation || 'portrait',
            adDisplayStrategy: config.displayStrategy || 'twice',
            adClickCallback: config.clickCallback || function() {},
            adCloseCallback: config.closeCallback || function() {},
            adDisplayCallback: config.displayCallback || function() {},
            adSwitchCallback: config.switchCallback || function() {},
            adFirstDisplayTime: typeof config.firstDisplayTime === 'undefined' ? 10 : config.firstDisplayTime,
            adBannerPosition: config.bannerPosition || {
                right: '30px',
                bottom: '30px'
            },
            adPlaceId: config.placeId,
            _duerosDebugadIframeUrl: config._duerosDebugadIframeUrl,
            adDisable: false,
        };

        if (!this.config.adDisable) {
            // 校验是否是数字，随后在某一时间开始弹出广告
            if (/\d+/.test(this.config.adFirstDisplayTime)) {
                clearTimeout(this._adFirstShowTimer);
                this._adFirstShowTimer = setTimeout(() => {
                    this._startCommonAdSwitch(true);
                    this._commonAdShowTimes--;
                }, this.config.adFirstDisplayTime * 1000);
            } else {
                throw new Error('firstDisplayTime must be a number, please check configuration');
            }
        }
        this._isAdInit = true;
    }

    /**
     * 处理广告界面通过postMessage传递过来的消息
     * @param event
     */
    handlePostMessageEvent(event) {
        if (event.origin !== this._adMsgTarget) {
            console.error('message target not matched');
            return;
        }
        let data = event.data;
        console.log('receive msg from iframe: ', data);
        if (data.type === 'ad_load_material') {
            if (!this._isCommonAdDisplaying) {
                this.config.adDisplayCallback();
            } else {
                this.config.adSwitchCallback();
            }
            this._isCommonAdDisplaying = true;
            this.botSDK.execLinkClick(data.data.linkClickUrl.map(url => {
                return {
                    url: url,
                    initiator: {
                        type: 'AUTO_TRIGGER'
                    }
                }
            }));
        } else if (data.type === 'ad_click') {
            this.config.adClickCallback();
            this.botSDK.execLinkClick(data.data.linkClickUrl.map(url => {
                return {
                    url
                }
            }));
            window.addEventListener('touchstart', this._screenTouched, true);
            this._pauseCommonAd();
        } else if (data.type === 'ad_close') {
            this.config.adCloseCallback();
            this.botSDK.execLinkClick(data.data.linkClickUrl.map(url => {
                return {
                    url
                }
            }));
            this._closeCommonAd();

            // 如果开发者选择广告策略 2
            // 则在某一时间之后再次打开
            if (this.config.adDisplayStrategy === 'twice') {
                // 如果广告打开次数还有剩余
                if (this._commonAdShowTimes > 0) {
                    this._commonAdShowTimes--;

                    // 控制竖屏广告展示在屏幕左侧还是右侧
                    this._lastVerticalAdDisplayIsLeft = !this._lastVerticalAdDisplayIsLeft;
                    clearTimeout(this._commonadReshowTimeout);
                    this._commonadReshowTimeout = setTimeout(() => {
                        this._startCommonAdSwitch(true);
                    }, this._commonAdReopenTimeout);
                }
            }
        }
    }

    /**
     * 从意图槽位中解析广告物料并渲染广告
     * @param {string} data
     */
    render(data) {
        // _isCommonAdClosed是个开关。因为广告物料的返回是异步的，且有时间间隔
        // 如果刚好在网络请求期间用户点击了关闭，然后物料返回
        // 了，这时就又会渲染广告，造成关不掉的现象
        if (this.config.adDisable || this._isCommonAdSwitchOff) {
            return;
        }

        let _data = JSON.parse(data);
        let serverAdIframeAddr = decodeURIComponent(_data.props.htmlAddress);
        if (_data.status === 0) {
            if (!this._adIframe1) {
                this._adIframe1 = createIframe({
                    width: 0,
                    height: 0,
                    zIndex: this.config.adZIndex,
                    background: 'transparent'
                });
                let adIframeQuery = encodeURIComponent(parseH5UrlOrigin(window.location.href));
                // 用于debug阶段，更改iframe地址
                if (this.config._duerosDebugadIframeUrl) {
                    this._adIframe1BaseUrl = this.config._duerosDebugadIframeUrl;
                    this._adMsgTarget = parseH5UrlOrigin(this.config._duerosDebugadIframeUrl);
                } else {
                    this._adIframe1BaseUrl = serverAdIframeAddr;
                    this._adMsgTarget = parseH5UrlOrigin(serverAdIframeAddr);
                }

                let adIframeUrl = '';
                if (this._adIframe1BaseUrl.indexOf('?') > -1) {
                    adIframeUrl = `${this._adIframe1BaseUrl}&msgTarget=${adIframeQuery}`
                } else {
                    adIframeUrl = `${this._adIframe1BaseUrl}?msgTarget=${adIframeQuery}`
                }

                this._adIframe1.src = adIframeUrl;
                document.body.appendChild(this._adIframe1);
            } else if (!this.config._duerosDebugadIframeUrl && this._adIframe1BaseUrl !== serverAdIframeAddr) {
                document.body.removeChild(this._adIframe1);
                this._adIframe1Loaded = false;
                this._adIframe1 = null;
                this.render(data); // TODO("这里似乎会陷入死循环，为什么要这么写？？")
                return;
            }
            this._adIframe1.style.display = 'block';
            this._setAdPosition();
            let postData = {
                type: 'ad_set_material',
                data: {
                    ..._data,
                    screenOrientation: this.config.screenOrientation,
                }
            };

            if (this._adIframe1Loaded) {
                this._adIframe1.contentWindow.postMessage(postData, this._adMsgTarget);
            } else {
                this._adIframe1.onload = () => {
                    this._adIframe1.contentWindow.postMessage(postData, this._adMsgTarget);
                    this._adIframe1Loaded = true;
                }
            }
        } else {
            console.error('Failed to get advertisement: ', _data);
        }
    }

    /**
     * 获取广告物料
     * @private
     */
    _requestCommonadMaterial() {
        let url = `dueros://f34646bc-37b4-a9db-361f-48fe7ca8831d/getAdResources?adPlaceId=${this.config.adPlaceId}&botId=${this.config.skillID}`
        this.botSDK.uploadLinkClicked({
            url,
            initiator: {
                type: 'AUTO_TRIGGER'
            }
        });
    }

    _setAdPosition() {
        // 如果是竖屏游戏
        if (this.config.screenOrientation === 'portrait') {
            this._adIframe1.style.cssText += 'width: 242px; height: 214px;bottom: 30px;';
            if (this._lastVerticalAdDisplayIsLeft) {
                this._adIframe1.style.left = '';
                this._adIframe1.style.right = '23px';
            } else {
                this._adIframe1.style.left = '23px';
                this._adIframe1.style.right = '';
            }
            // 如果是全屏游戏
        } else if (this.config.screenOrientation === 'landscape') {
            this._adIframe1.style.cssText += 'width: 446px; height: 118px;';
            if (isSet(this.config.adBannerPosition.top)) {
                this._adIframe1.style.top = this.config.adBannerPosition.top;
            }
            if (isSet(this.config.adBannerPosition.right)) {
                this._adIframe1.style.right = this.config.adBannerPosition.right;
            }
            if (isSet(this.config.adBannerPosition.bottom)) {
                this._adIframe1.style.bottom = this.config.adBannerPosition.bottom;
            }
            if (isSet(this.config.adBannerPosition.left)) {
                this._adIframe1.style.left = this.config.adBannerPosition.left;
            }
        }
    }

    /**
     * 开始轮换广告
     * @param {boolean} fireImmediately 是否立即轮换一次广告
     * @private
     */
    _startCommonAdSwitch(fireImmediately) {
        this._isCommonAdSwitchOff = false;
        if (fireImmediately) {
            // 请求到素材后，会在onHandleIntent里处理
            this._requestCommonadMaterial();
        }
        clearInterval(this._commonAdSwitchTimer);
        this._commonAdSwitchTimer = setInterval(() => {
            // 请求到素材后，会在onHandleIntent里处理
            this._requestCommonadMaterial();
        }, this._commonadSwitchInterval);
    }


    _closeCommonAd() {
        clearInterval(this._commonAdSwitchTimer);
        this._isCommonAdSwitchOff = true;
        this._adIframe1.style.display = 'none';
        this._isCommonAdDisplaying = false;
    }

    /**
     * 暂停广告轮换
     * @private
     */
    _pauseCommonAd() {
        clearInterval(this._commonAdSwitchTimer);
        this._isCommonAdSwitchOff = true;
    }

    _screenTouched = () => {
        window.removeEventListener('touchstart', this._screenTouched, true);
        this._startCommonAdSwitch(true);
    }
}
