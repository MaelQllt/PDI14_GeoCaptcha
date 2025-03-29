// audit-service.js
import axios from 'axios';

class AuditService {
  constructor() {
    this.auditLogs = [];
    this.apiEndpoint = '/api/audit-logs'; // Endpoint pour sauvegarder les logs côté serveur
    this.excludeNavigation = true; // Paramètre pour exclure les logs de navigation
    this.excludeStartup = true; // Paramètre pour exclure le log de démarrage
  }

  /**
   * Enregistre une action dans les logs d'audit
   * @param {string} action - Type d'action (CREATE, UPDATE, DELETE, ERROR)
   * @param {string} route - Route concernée
   * @param {string} description - Description de l'action
   * @param {Object} userData - Données utilisateur supplémentaires (optionnel)
   */
  logAction(action, route, description, userData = {}) {

    // Vérifier si l'action est exclue
    if ((this.excludeNavigation && action === 'NAVIGATE') || (this.excludeStartup && action === 'INFO')) {
      return;
    }

    const timestamp = new Date();
    const formattedTime = `${timestamp.getHours()}:${String(timestamp.getMinutes()).padStart(2, '0')} - ${String(timestamp.getDate()).padStart(2, '0')}/${String(timestamp.getMonth() + 1).padStart(2, '0')}/${timestamp.getFullYear()}`;
    
    const logEntry = {
      action,
      route,
      description,
      timestamp: formattedTime,
      rawTimestamp: timestamp,
      userData,
    };
    
    this.auditLogs.push(logEntry);
    
    // Envoyer le log au serveur si configuré
    this.saveToServer(logEntry);
    
    // Stocker dans le localStorage pour persistance locale
    this.saveToLocalStorage();
    
    return logEntry;
  }
  
  // Méthodes spécifiques pour chaque type d'action
  logCreate(route, description, userData = {}) {
    return this.logAction('CREATE', route, description, userData);
  }
  
  logUpdate(route, description, userData = {}) {
    return this.logAction('UPDATE', route, description, userData);
  }
  
  logDelete(route, description, userData = {}) {
    return this.logAction('DELETE', route, description, userData);
  }
  
  logError(route, description, userData = {}) {
    return this.logAction('ERROR', route, description, userData);
  }
  
  // Récupérer tous les logs d'audit
  getLogs() {
    return this.auditLogs;
  }
  
  // Filtrer les logs par critères
  filterLogs(criteria = {}) {
    return this.auditLogs.filter(log => {
      for (const [key, value] of Object.entries(criteria)) {
        if (log[key] !== value) return false;
      }
      return true;
    });
  }
  
  // Sauvegarder logs sur le serveur
  async saveToServer(logEntry) {
    try {
      await axios.post(this.apiEndpoint, logEntry);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du log d\'audit:', error);
      // On ne veut pas que l'erreur d'audit génère une autre erreur d'audit
    }
  }
  
  // Sauvegarder dans localStorage pour persistance locale
  saveToLocalStorage() {
    try {
      localStorage.setItem('auditLogs', JSON.stringify(this.auditLogs));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale des logs d\'audit:', error);
    }
  }
  
  // Charger les logs depuis localStorage
  loadFromLocalStorage() {
    try {
      const storedLogs = localStorage.getItem('auditLogs');
      if (storedLogs) {
        this.auditLogs = JSON.parse(storedLogs);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des logs d\'audit:', error);
    }
  }
  
  // Effacer tous les logs
  clearLogs() {
    this.auditLogs = [];
    localStorage.removeItem('auditLogs');
  }
}

// Exporter une instance unique du service
export const auditService = new AuditService();

// Initialiser avec les logs stockés localement
auditService.loadFromLocalStorage();

export default auditService;
