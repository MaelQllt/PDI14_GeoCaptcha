import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import CreateGeoCaptcha from '../views/CreateGeoCaptcha.vue';
import Dashboard from '../views/Dashboard.vue';
import KeyAccess from '../views/KeyAccess.vue';
import Test from '../views/Dashboard2.vue';
import Test2 from '../views/Dashboard.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/geo-captcha', name: 'geo-captcha', component: CreateGeoCaptcha },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/key-access', name: 'key-access', component: KeyAccess },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
