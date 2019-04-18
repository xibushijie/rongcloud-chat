import Vue from 'vue'
import App from './App.vue'
import rongyun from '@/assets/rongyun/RongIMLib-2.4.0.min.js'

Vue.config.productionTip = false

Vue.prototype.rongyun = rongyun

new Vue({
  render: h => h(App),
}).$mount('#app')
