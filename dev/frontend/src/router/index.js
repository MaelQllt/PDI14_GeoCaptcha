import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import ConnexionAdmin from '../views/ConnexionAdmin.vue';
import ServiceUtilisateur from '@/views/ServiceUtilisateur.vue';
import CreateGeoCaptcha from '../views/CreateGeoCaptcha.vue';
import Dashboard from '../views/Dashboard.vue';
import KeyAccess from '../views/KeyAccess.vue';


const routes = [
  { path: '/', component: Home },
  { path: '/connexion-admin', name: 'connexion-admin', component: ConnexionAdmin },
  { path: '/service-utilisateur', name: 'service-utilisateur', component: ServiceUtilisateur },
  { path: '/geo-captcha', name: 'geo-captcha', component: CreateGeoCaptcha, meta: { requiresAuth: true } },
  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/key-access', name: 'key-access', component: KeyAccess, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});
export default router;
