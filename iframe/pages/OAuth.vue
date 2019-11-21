<template>
    <div class="oc-mask" @click="denyOAuth">
        <div class="o-container" @click.stop>
            <template v-if="errMsg">
                <div class="o-err">{{errMsg}}</div>
            </template>
            <template v-else>
                <div class="o-title-bar">
                    <div class="o-title-bar-logo" :style="{backgroundImage: `url(${iconUrl})`}"><img src="https://oss-media.cdn.bcebos.com/common/4708368c-b169-eb8d-fdc8-1b1109368bcb.png"></div>
                    <div class="o-title-bar-name">{{botName}}</div>
                    <div class="o-title-bar-desc">申请</div>
                </div>
                <div class="o-h1">授权登录设备账号</div>
                <div class="o-desc">允许授权后，技能将获取你的头像、昵称信息，用于提供相关服务</div>
                <div class="o-footer">
                    <div class="o-button o-button-deny" @click="denyOAuth">拒绝</div>
                    <div :class="{'o-button o-button-allow': true, 'o-button-disable': isGranting}" @click="requireOAuth">{{isGranting ? '授权中' : '允许'}}</div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import * as utils from '../utils';
import { setTimeout, clearTimeout } from 'timers';

const pageQuery = utils.getQuery();
const AUTHORIZED_SUCCESS = 'authorized_success';
const AUTHORIZED_FAIL = 'authorized_fail';
const BOT_INFO = 'bot_info';

export default {
    data() {
        return {
            iconUrl: '',
            botName: '',
            callbackUrl: '',
            errMsg: '',
            isGranting: false
        }
    },
    methods: {
        register(cb) {
            this.axios.get('/voiceapp/botverification', {
                params: {
                    botId: pageQuery.botId,
                    random1: pageQuery.random1,
                    signature1: pageQuery.signature1,
                    random2: pageQuery.random2,
                    signature2: pageQuery.signature2
                }
            }).then(({data}) => {
                if (data.status === 0) {
                    cb(null, 'verifi success');
                } else {
                    cb(data.msg);
                }
            }).catch(e => {
                cb(e);
            });
        },
        getBotInfo() {
            this.axios.get('/voiceapp/h5getbotinfo', {
                params: {
                    botId: pageQuery.botId
                }
            })
            .then(({data}) => {
                let msg = {
                    type: BOT_INFO,
                };
                if (data.status === 0) {
                    this.iconUrl = data.data.iconUrl;
                    this.botName = data.data.botName;
                    this.callbackUrl = data.data.callbackUrl;
                    this.postMessageTargetOrigin = this.parseH5Url(this.callbackUrl);
                    msg.data = {
                        accessToken: data.data.access_token || null
                    };
                } else {
                    this.errMsg = data.msg;
                    msg.data = {
                        accessToken: null
                    };
                }
                window.parent.postMessage(msg, this.postMessageTargetOrigin);
            }).catch(e => {
                console.error(e);
                this.errMsg = '技能信息获取失败';
            });
        },
        requireOAuth() {
            if (this.isGranting) {
                return;
            }
            if (this.postMessageTargetOrigin) {
                this.isGranting = true;
                this.axios.get('/saiya/v1/h5authorize/appauth', {
                    params: {
                        botId: pageQuery.botId
                    }
                }).then(({data}) => {
                    this.isGranting = false;
                    let msg = null;
                    if (data.status === 0) {
                        msg = {
                            type: AUTHORIZED_SUCCESS,
                            data: {
                                accessToken: data.data.access_token
                            }
                        };
                    } else {
                        msg = {
                            type: AUTHORIZED_FAIL,
                            data: data.msg
                        };
                    }
                    window.parent.postMessage(msg, this.postMessageTargetOrigin);
                }).catch(e => {
                    this.isGranting = false;
                    let msg = {
                        type: AUTHORIZED_FAIL,
                        data: e
                    };
                    window.parent.postMessage(msg, this.postMessageTargetOrigin);
                });
            } else {
                console.error('Illegal H5 URL: ', this.postMessageTargetOrigin);
            }
        },
        denyOAuth() {
            if (this.postMessageTargetOrigin) {
                let data = {
                    type: AUTHORIZED_FAIL,
                    data: null
                };
                window.parent.postMessage(data, this.postMessageTargetOrigin);
            } else {
                console.error('illegal H5 URL :', this.postMessageTargetOrigin);
            }
        },
        parseH5Url(url) {
            if (url) {
                const a = document.createElement('a');
                a.href = url;
                return a.origin;
            } else {
                return ''
            }
        },
        shipping(shipData) {
            this.axios.get('/voiceapp/shippingorder', {
                params: {
                    botId: pageQuery.botId,
                    ...shipData,
                    source: 'skillstoreapp' // 目前写死
                }
            }).then(({data}) => {
                if (data.status === 0) {
                    let postData = {};
                    let receiveData = data.data && data.data.length && data.data[0];
                    // 如果已经返回数据
                    if (receiveData) {
                        postData = {
                            authorizationDetails: {
                                authorizationAmount: { //
                                    amount: receiveData.sellerAmount, // 扣款金额。比如：1.09，数字字符串。系统取小数点后两位，单位：元
                                    currencyCode: 'CNY' // 枚举类型。目前只能为CNY
                                },
                                capturedAmount: {
                                    amount: receiveData.payAmount, // 实际百度扣款金额。比如：1.09，数字字符串。系统取小数点后两位，单位：元
                                    currencyCode: 'CNY' // 枚举类型。目前只能为CNY
                                },
                                creationTimestamp: receiveData.createTime // 订单创建时间。时间戳，单位毫秒
                            },
                            baiduOrderReferenceId: receiveData.baiduOrderReferenceId, // 此次交易百度生成的订单ID
                            purchaseResult: 'SUCCESS', // 此次支付结果。 -枚举值，选值范围： - SUCCESS 支付成功 - ERROR 支付发生错误
                            message: '支付成功' // 支付状态对应的消息
                        };
                        window.parent.postMessage({
                            type: 'ship',
                            err: null,
                            data: postData
                        }, this.postMessageTargetOrigin);

                    // 由于后端发货相关通知是异步的，所以这里
                    // 设定一个重试机制
                    } else {
                        if (this.retryTimes > 0) {
                            this.retryTimes = this.retryTimes - 1;
                            clearTimeout(this.timer);
                            this.timer = setTimeout(() => {
                                this.shipping(shipData);
                            }, 1000);
                        } else {
                            postData = {
                                authorizationDetails: null,
                                baiduOrderReferenceId: receiveData.baiduOrderReferenceId,
                                purchaseResult: 'ERROR', // 此次支付结果。 -枚举值，选值范围： - SUCCESS 支付成功 - ERROR 支付发生错误
                                message: '支付失败'
                            };
                            window.parent.postMessage({
                                type: 'ship',
                                err: null,
                                data: postData
                            }, this.postMessageTargetOrigin);
                        }
                    }
                } else {
                    window.parent.postMessage({
                        type: 'ship',
                        err: data.msg,
                        data: data.data
                    }, this.postMessageTargetOrigin);
                }
            }).catch(e => {
                window.parent.postMessage({
                    type: 'ship',
                    err: e,
                    data: data.data
                }, this.postMessageTargetOrigin);
            });
        },
    },
    mounted() {
        this.register((err, data) => {
            if (!err) {
                this.getBotInfo();
            } else {
                this.errMsg = '身份校验失败，请检查签名';
                console.error(data);
            }
        });
        this.postMessageTargetOrigin = '';

        window.addEventListener('message', (event) => {
            if (event.origin === this.postMessageTargetOrigin) {
                let data = event.data;
                console.log('message from parent page', data);
                if (data.type === 'ship') {
                    this.shipping(data.data);
                    this.retryTimes = 2; // 定义发货请求到空之后重试次数
                }
            }
        });
    }
}
</script>

<style lang="less">
body,
div,
dl,
dt,
dd,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
code,
form,
fieldset,
legend,
input,
button,
textarea,
p,
blockquote,
th,
td {
  margin: 0;
  padding: 0;
}
body {
  background: #fff;
  color: #fff;
  font-size: 14px;
  font-family: Microsoft Yahei, Verdana, Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;

}
body a {
    color: #fff;
}
td,
th,
caption {
  font-size: 14px;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: normal;
  font-size: 100%;
}
address,
caption,
cite,
code,
dfn,
em,
strong,
th,
var {
  font-style: normal;
  font-weight: normal;
}
a {
  color: #555;
  text-decoration: none;
}
img {
  border: none;
}
ol,
ul,
li {
  list-style: none;
}
input,
textarea,
select,
button {
  font: 14px Verdana, Helvetica, Arial, sans-serif;
}
table {
  border-collapse: collapse;
}
html {
  overflow-y: scroll;
}

html,body {
    height: 100%;
    background-color: transparent;
}

.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  *zoom: 1;
}

.o-container {
    padding-left: .4rem;
    padding-right: .4rem;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    border-top-left-radius: .5rem;
    border-top-right-radius: .5rem;
    box-sizing: border-box;
    height: 5.2rem;
}

.o-title-bar {
    display: flex;
    margin-top: .7rem;
}
.o-title-bar-logo {
    width: .6rem;
    height: .6rem;
    background: #ccc no-repeat;
    background-size: 100% 100%;
    img {
        width: 100%;
        height: 100%;
    }
}
.o-title-bar-name {
    font-size: .3rem;
    color: #191D25;
    line-height: .6rem;
    font-weight: bold;
    margin-left: .16rem;
    max-width: 4.8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

}
.o-title-bar-desc {
    font-size: .3rem;
    color: #191D25;
    line-height: .6rem;
    margin-left: .1rem;
}
.o-h1 {
    font-size: .4rem;
    color: #191D25;
    line-height: 1;
    margin-top: .34rem;
}
.o-desc {
    font-size: .26rem;
    color: #73757A;
    margin-top: .22rem;
    line-height: .38rem;
}
.o-footer {
    display: flex;
    justify-content: space-between;
    margin-top: .38rem;
    padding-bottom: .8rem;
}
.o-button {
    width: 3.2rem;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-size: .36rem;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    &.o-button-deny {
        color: #7649D7;
        background-image: url(https://oss-media.cdn.bcebos.com/common/259c1c85-c579-df37-9a5c-710eb387a183.png);
    }
    &.o-button-allow {
        color: #fff;
        background-image: url(https://oss-media.cdn.bcebos.com/common/59d3382c-f5b8-3585-be4e-7e5527de2106.png);
    }
    &.o-button-disable {
        opacity: .6;
    }
}
.o-err {
    color: #000;
    margin-top: .8rem;
    font-size: .32rem;
}
.oc-mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}
</style>
