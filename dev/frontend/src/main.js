import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@gouvfr/dsfr/dist/dsfr.min.css';
import '@gouvfr/dsfr/dist/utility/utility.min.css';
import { auditService } from './services/audit-service';

// Créer l'application Vue
const app = createApp(App);

// Rendre le service d'audit disponible globalement
app.config.globalProperties.$audit = auditService;

// Intercepter les erreurs non capturées de l'application
app.config.errorHandler = (err, vm, info) => {
  auditService.logError(
    router.currentRoute.value.path,  // Notez le .value pour Vue 3
    `Erreur non capturée: ${err.message}`,
    {
      component: vm?.$options?.name || 'Unknown',
      info,
      stack: err.stack
    }
  );

  // Ne pas oublier de continuer à loguer l'erreur dans la console
  console.error(err);
};

// Configurer le router pour enregistrer les navigations
router.beforeEach((to, from) => {
  auditService.logAction('NAVIGATE', to.path, `Navigation vers ${to.name || to.path}`);
  return true;
});

// Loguer le démarrage de l'application
auditService.logAction('INFO', '/', 'Application démarrée');

// Monter l'application
app.use(router);
app.mount('#app');