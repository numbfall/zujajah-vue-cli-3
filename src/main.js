import Vue from 'vue'
import App from './App.vue'
import jquery from 'jquery'
import 'semantic-ui-css/semantic.min.css'
import 'semantic-ui-css/semantic.min.js'

Vue.directive('dropdown', {
  bind(el) {
    jquery(el).dropdown() // http://semantic-ui.com/modules/dropdown.html#/usage
  }
})

Vue.directive('accordion', {
  bind(el) {
    jquery(el).accordion() // http://semantic-ui.com/modules/dropdown.html#/usage
  }
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
