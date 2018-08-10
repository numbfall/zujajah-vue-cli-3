import Vue from 'vue'
import App from './App.vue'
import 'semantic-ui-css/semantic.min.css'
import 'semantic-ui-css/semantic.min.js'

window.jQuery = require('jquery')

Vue.directive('dropdown', {
  bind(el) {
    $(el).dropdown()
  }
})

Vue.directive('accordion', {
  bind(el) {
    $(el).accordion()
  }
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
