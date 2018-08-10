import Vue from 'vue'
import App from './App.vue'
import 'semantic-ui-css/semantic.min.css'
import 'semantic-ui-css/semantic.min.js'
import 'vue-resize/dist/vue-resize.css'
import VueResize from 'vue-resize'

Vue.use(VueResize)

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
