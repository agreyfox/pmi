import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import {
  store
} from './store/'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
Vue.use(Vuetify)
Vue.config.productionTip = false
// console.log('chain3 connect is ' + chain3.isConnected()) // {mc: .., db: ..., net: ...} // it's here!

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
