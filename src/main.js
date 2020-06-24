import 'babel-polyfill';
require('intersection-observer');


import Vue from 'vue';
import App from './App.vue';


new Vue({
  render: h => h(App)
}).$mount('#app')
