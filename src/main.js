// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
//import fastClick from 'fastclick'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import Mint from 'mint-ui'

import '../static/rem'
import '../static/css/reset.css'
import '../static/css/border.css'
import 'swiper/dist/css/swiper.min.css'
import 'mint-ui/lib/style.css'
/*fastClick.attach(document.body)*/
Vue.config.productionTip = false
Vue.use(VueAwesomeSwiper)
Vue.use(Mint)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
