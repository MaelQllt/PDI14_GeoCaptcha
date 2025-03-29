// audit-plugin.js - version corrigée pour Vue 3
import { auditService } from '../services/audit-service';
import axios from 'axios';

// Plugin d'audit pour Vue 3
export default {
  install(app, options) {
    // Attacher le service à l'instance Vue
    app.config.globalProperties.$audit = auditService;
    
    // Intercepter les requêtes HTTP
    axios.interceptors.request.use(config => {
      // Ne pas logger les requêtes d'audit pour éviter les boucles
      if (!config.url.includes('/api/audit-logs')) {
        const action = determineAction(config.method);
        auditService.logAction(
          action, 
          config.url, 
          `${action} sur ${config.url}`,
          { payload: config.data }
        );
      }
      return config;
    });
    
    // Intercepter les erreurs HTTP
    axios.interceptors.response.use(
      response => response,
      error => {
        if (!error.config.url.includes('/api/audit-logs')) {
          auditService.logError(
            error.config.url,
            `Erreur ${error.response?.status || 'réseau'} sur ${error.config.url}`,
            { 
              status: error.response?.status,
              data: error.response?.data
            }
          );
        }
        return Promise.reject(error);
      }
    );
  }
};

// Méthode helper pour déterminer l'action basée sur la méthode HTTP
function determineAction(method) {
  switch (method.toUpperCase()) {
    case 'POST': return 'CREATE';
    case 'PUT':
    case 'PATCH': return 'UPDATE';
    case 'DELETE': return 'DELETE';
    default: return 'READ';
  }
}