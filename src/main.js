import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import { createPinia, PiniaVuePlugin } from 'pinia'
import VueCompositionAPI from '@vue/composition-api'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

Vue.use(VueCompositionAPI)
Vue.use(PiniaVuePlugin)
Vue.use(VueToast);
Vue.use(ElementUI);

Vue.config.productionTip = false

const pinia = createPinia()

new Vue({
  render: h => h(App),
  pinia,
}).$mount('#app')
