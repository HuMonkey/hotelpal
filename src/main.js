// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import util from './util'

Vue.config.productionTip = false

Vue.directive('focus', {
  inserted: function(el) {
    el.focus()
  }
})

if (util.ua.wechat) {
	try {
    // document.domain = 'hotelpal.cn';
  } catch (err) {
  	alert(err)
  }
  var el = document.createElement('script');
  el.setAttribute('src', 'https://res.wx.qq.com/open/js/jweixin-1.0.0.js');
  document.body.appendChild(el);
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
