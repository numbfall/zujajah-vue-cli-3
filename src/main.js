import Vue from 'vue'
import App from './App.vue'
import 'semantic-ui-css/semantic.min.css'
import 'semantic-ui-css/semantic.min.js'

window.jQuery = require('jquery')

Vue.directive('popup', {
  bind(el) {
    $(el).popup() // http://semantic-ui.com/modules/dropdown.html#/usage
  }
})

Vue.directive('dropdown', {
  bind(el) {
    $(el).dropdown() // http://semantic-ui.com/modules/dropdown.html#/usage
  }
})

Vue.directive('accordion', {
  bind(el) {
    $(el).accordion() // http://semantic-ui.com/modules/dropdown.html#/usage
  }
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
