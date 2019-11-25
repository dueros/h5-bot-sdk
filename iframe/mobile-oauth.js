/**
 * @file 小度APP上游戏授权页面
 * @author dengxuening<dengxuening@baidu.com>
 */

import Vue from 'vue';
import OAuth from './pages/OAuth.vue';

Vue.config.productionTip = false;

new Vue({
    render: h => h(OAuth)
}).$mount('#app');
