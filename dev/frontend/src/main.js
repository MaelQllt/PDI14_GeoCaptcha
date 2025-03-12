import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@gouvfr/dsfr/dist/dsfr.min.css';
import '@gouvfr/dsfr/dist/utility/utility.min.css';



const app = createApp(App);
app.use(router);
app.mount('#app');
