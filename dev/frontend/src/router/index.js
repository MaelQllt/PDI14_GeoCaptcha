import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import CreateGeoCaptcha from '../views/CreateGeoCaptcha.vue';
import Dashboard from '../views/Dashboard.vue';
import KeyAccess from '../views/KeyAccess.vue';
import Test from '../views/Dashboard2.vue';
import Test2 from '../views/Dashboard3.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/geo-captcha', name: 'geo-captcha', component: CreateGeoCaptcha },
  { path: '/dashboard', name: 'dashboard', component: Test2 },
  { path: '/key-access', name: 'key-access', component: KeyAccess },
  { path: '/test', name: 'test', component: Test },
  { path: '/test2', name: 'test2', component: Dashboard }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;