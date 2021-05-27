import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import store from './store';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import Clipboard from 'v-clipboard'

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueMaterial);
Vue.use(Clipboard);

const vm = new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');

export default vm;
