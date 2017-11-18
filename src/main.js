// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'swiper/dist/css/swiper.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import App from './App'
import router from './router'

import util from './util'

Vue.config.productionTip = false

Vue.use(VueAwesomeSwiper)

Vue.directive('focus', {
  inserted: function(el) {
    el.focus()
  }
})

document.body.onselectstart = new Function("return false");

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
