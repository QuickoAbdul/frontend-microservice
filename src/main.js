import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue' 
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/styles/sb-admin-2.css';

createApp(App).use(bootstrap).use(router).mount('#app');

Vue.config.devtools = true;
Vue.config.productionTip = false;