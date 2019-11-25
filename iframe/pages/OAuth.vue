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
        postMessage(data) {
            window.parent.postMessage(data, '*');
        },
        requireOAuth() {
            if (this.isGranting) {
                return;
            }
            this.isGranting = true;
            this.postMessage({
                type: 'allow_authorize'
            });
        },
        denyOAuth() {
            this.postMessage({
                type: 'deny_authorize'
            });
        },
        parseH5Url(url) {
            if (url) {
                const a = document.createElement('a');
                a.href = url;
                return a.origin;
            } else {
                return ''
            }
        }
    },
    mounted() {
        this.msgTarget = '';
        window.addEventListener('message', (event) => {
            // if (event.origin === this.msgTarget) {
                let data = event.data;
                console.log('message from parent page', data);
                if (data.type === 'bot_info') {
                    if (data.err) {
                        this.errMsg = '技能信息获取失败';
                    } else {
                        this.iconUrl = data.data.iconUrl;
                        this.botName = data.data.botName;
                        this.callbackUrl = data.data.callbackUrl;
                    }
                    // this.msgTarget = this.parseH5Url(this.callbackUrl);
                } else if (data.type === 'authorized_finish') {
                    this.isGranting = false;
                }
            // }
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
