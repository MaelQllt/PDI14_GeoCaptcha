import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import CreateGeoCaptcha from '../views/CreateGeoCaptcha.vue';
import Dashboard from '../views/Dashboard.vue';
import KeyAccess from '../views/KeyAccess.vue';
import Test from '../views/text.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/geo-captcha', name: 'geo-captcha', component: CreateGeoCaptcha },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/key-access', name: 'key-access', component: KeyAccess }, 
  { path: '/test', name: 'test', component: Test },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
