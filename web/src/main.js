// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/black-green-light.css'

Vue.use(VueMaterial)

/* eslint-disable no-new, no-unused-vars */
const vm = new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
