<template>
    <div class="dashboard">
      
      <div class="fr-tabs">
        <!-- Liste des onglets -->
        <ul class="fr-tabs__list" role="tablist" aria-label="Navigation des onglets">
          <li role="presentation">
            <button
              id="tabpanel-404"
              class="fr-tabs__tab fr-icon-slideshow-line fr-tabs__tab--icon-left"
              :class="{ 'fr-tabs__tab--selected': activeTab === 'tabpanel-404' }"
              role="tab"
              :aria-selected="activeTab === 'tabpanel-404'"
              aria-controls="tabpanel-404-panel"
              @click="switchTab('tabpanel-404')"
            >
              Gestion de GéoCaptcha
            </button>
          </li>
          <li role="presentation">
            <button
              id="tabpanel-405"
              class="fr-tabs__tab fr-icon-survey-line fr-tabs__tab--icon-left"
              :class="{ 'fr-tabs__tab--selected': activeTab === 'tabpanel-405' }"
              role="tab"
              :aria-selected="activeTab === 'tabpanel-405'"
              aria-controls="tabpanel-405-panel"
              @click="switchTab('tabpanel-405')"
            >
              Piste d'audit
            </button>
          </li>
        </ul>
  
        <!-- Contenus des onglets -->
        <div
          id="tabpanel-404-panel"
          class="fr-tabs__panel tab-404"
          :class="{ 'fr-tabs__panel--selected': activeTab === 'tabpanel-404' }"
          role="tabpanel"
          aria-labelledby="tabpanel-404"
        > 
    
        <div class="metrics-list">
            <div class="list-header">
              <h1 class="fr-h1">Gestion de Géocaptcha</h1>
              <div class="fr-select-group select-group-metrics">
                <label class="fr-label trier-metrics" for="filter-select">
                  <span class="fr-icon-filter-line fr-icon--sm" aria-hidden="true"></span>
                  Trier
                </label>
                <select class="fr-select select-metrics" aria-describedby="select-messages" id="filter-select" v-model="filterOption" @change="applyFilter">
                  <option value="id-asc">ID (croissant)</option>
                  <option value="id-desc">ID (décroissant)</option>
                  <option value="success-asc">Précision (croissant)</option>
                  <option value="success-desc">Précision (décroissant)</option>
                </select>
              </div>
            </div>
          </div>
  
          <div class="fr-grid-row fr-grid-row--gutters">
              <div v-for="item in paginatedItems" :key="item.id" class="fr-col-12 fr-col-md-6 fr-col-lg-4" @click="selectGeocaptcha(item)">
                <div class="fr-tile" :class="getAccuracyClass(item.accuracy, item.attempts)" id="tile-7451">
                  <div class="fr-tile__header">
                      <p><strong class="fr-tile__title">ID:</strong> {{ item.id }}</p>                  
                  </div>
                  <div class="fr-tile__body">
                    
                      <img :src="logoSrc" alt="Logo Géocaptcha" class="geocaptcha-logo" />
                    
                      <div class="infos">
                          <div class="info-item attempts">
                          <p><strong>Nombre d'essais: </strong> {{ item.attempts }}</p>
                          </div>
                          <div class="info-item gauge">
                          <GaugeChart :value="item.accuracy" min="0" max="100" label="Précision (en %)" />
                          </div>
                      </div>
                  </div>
                </div>
              </div>
          </div>
  
          <!-- Pagination des métriques -->
          <div class="fr-pagination" v-if="filteredItems.length > 0">
            <button class="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-left-s-line" 
                    :disabled="currentMetricsPage === 1" 
                    @click="handlePageChange(currentMetricsPage - 1)">
            </button>
            <span class="page-info">{{ currentMetricsPage }} / {{ totalMetricsPages }}</span>
            <button class="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-right-s-line" 
                    :disabled="currentMetricsPage === totalMetricsPages" 
                    @click="handlePageChange(currentMetricsPage + 1)">
            </button>
          </div>
  
          <!-- Vous pouvez ajouter un indicateur de chargement qui s'affiche uniquement pendant le chargement initial -->
          <div v-if="loading" class="loading-indicator">
            Chargement de tous les géocaptchas...
          </div>
  
            <!-- Modal pour Détails du Géocaptcha -->
            <div v-if="isModalVisible" class="modal-overlay">
              <div class="fr-container fr-container--fluid fr-container-md">
                <div class="fr-grid-row fr-grid-row--center">
                  <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
                    <div class="fr-modal__body">
                      <div class="fr-modal__header">
                        <h2 id="modal-6053-title" class="fr-modal__title">
                          <span class="fr-icon-arrow-right-line fr-icon--lg" aria-hidden="true"></span>
                          Détails du Géocaptcha
                        </h2>
                        <button @click="closeModal" class="fr-btn--close fr-btn">Fermer</button>
                      </div>
                      <div class="fr-modal__content">
                        <div>
                          <p><strong>ID:</strong> {{ selectedGeocaptcha.id }}</p>
                          <p><strong>IP:</strong> {{ selectedGeocaptcha.ip }}</p>
                          <p><strong>Essais:</strong> {{ selectedGeocaptcha.attempts }}</p>
                          <p><strong>Réussites:</strong> {{ selectedGeocaptcha.successes }}</p>
                          <p><strong>Echecs:</strong> {{ selectedGeocaptcha.failures }}</p>
                          <p><strong>Précision:</strong> {{ selectedGeocaptcha.accuracy }}%</p>
                          <p><strong>Referer:</strong> {{ selectedGeocaptcha.referer }}</p>
                          <p><strong>Date de création:</strong> {{ selectedGeocaptcha.createdAt }}</p>
                        </div>
  
                        <!-- Afficher les images du défi -->
                        <div>
                          <img :src="`https://qlf-geocaptcha.ign.fr/api/v1/admin/challenge/${selectedGeocaptcha.challenge.backendId}`" alt="Backend" />
                          <img :src="`https://qlf-geocaptcha.ign.fr/api/v1/admin/challenge/${selectedGeocaptcha.challenge.frontendId}`" alt="Frontend" />
                        </div>
                      </div>
  
                      <div class="fr-modal__footer">
                        <div class="fr-btns-group fr-btns-group--center fr-btns-group--inline-lg fr-btns-group--icon-left">
                          <button @click="showConfirmationModal" class="fr-btn fr-btn--reject">Rejeter</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Modal de confirmation -->
            <div v-if="isConfirmationModalVisible" class="modal-overlay">
              <div class="fr-container fr-container--fluid fr-container-md">
                <div class="fr-grid-row fr-grid-row--center">
                  <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
                    <div class="fr-modal__body">
                      <div class="fr-modal__header">
                        <h2 id="modal-6053-title" class="fr-modal__title">
                          <span class="fr-icon-warning-line fr-icon--lg" aria-hidden="true"></span>
                          Confirmation
                        </h2>
                        <button @click="closeConfirmationModal" class="fr-btn--close fr-btn">Fermer</button>
                      </div>
                      <div class="fr-modal__content">
                        <p>Êtes-vous sûr de vouloir rejeter ce géocaptcha ?</p>
                      </div>
                      <div class="fr-modal__footer fr-btns-group--right fr-btns-group--inline-lg fr-btns-group--icon-left">
                        <button @click="rejectGeocaptcha" class="fr-btn fr-btn--reject">Oui, Rejeter</button>
                        <button @click="closeConfirmationModal" class="fr-btn fr-btn--cancel">Annuler</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>  
  
  
        <div
          id="tabpanel-405-panel"
          class="fr-tabs__panel tab-405"
          :class="{ 'fr-tabs__panel--selected': activeTab === 'tabpanel-405' }"
          role="tabpanel"
          aria-labelledby="tabpanel-405"
        >
        <h1>Piste d'audit</h1>
  
        <div class="audit-container">
        
          <div class="fr-input-group">
  
              <div class="filtre">
                  <select id="filter-route" v-model="filterRoute" class="fr-select filtre-route">
                  <option value="">Filtre par route</option>
                  <option v-for="route in uniqueRoutes" :key="route" :value="route">{{ route }}</option>
                  </select>
              
              
                  <button class="fr-btn-tertiary-no-outline fr-icon-refresh-line btn-refresh" @click="clearFilters"></button>
              </div>
              <button class="fr-btn fr-btn--danger delete-log" @click="confirmDeleteLogs" :disabled="logs.length === 0">Tout effacer</button>
  
          </div>
      
          <div v-if="filteredLogs.length === 0" class="fr-container">
          <div class="box-audit box-info">
              <span class="action-audit action-info">INFO</span>
              <span class="description-audit">Aucune entrée d'audit ne correspond aux filtres.</span>
          </div>
          </div>
          
          <div v-for="(log, index) in filteredLogs" :key="index" class="fr-container">
          <div :class="['box-audit', getBoxClass(log.action)]">
              <span :class="['action-audit', getActionClass(log.action)]">{{ log.action }}</span>
              <span class="route-audit">{{ log.route }}</span>
              <span class="description-audit">{{ log.description }}</span>
              <span class="time-audit">{{ log.timestamp }}</span>
          </div>
          </div>
          
          <div class="fr-pagination" v-if="filteredLogs.length > 0">
          <button class="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-left-s-line" 
                  :disabled="currentPage === 1" 
                  @click="currentPage--">
          </button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button class="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-right-s-line" 
                  :disabled="currentPage === totalPages" 
                  @click="currentPage++">
          </button>
          </div>
        </div>
  
        <div class="modal-overlay" v-if="showDeleteModal">
          <div class="fr-container fr-container--fluid fr-container-md">
                  <div class="fr-grid-row fr-grid-row--center">
                      <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
                      <div class="fr-modal__body">
                          <div class="fr-modal__header">
                          <button @click="showDeleteModal = false" aria-controls="modal-6053" title="Fermer" type="button" id="button-6054" class="fr-btn--close fr-btn">Fermer</button>
                          </div>
                          <div class="fr-modal__content">
                          <h1 id="modal-6053-title" class="fr-modal__title">
                              <span class="fr-icon-arrow-right-line fr-icon--lg" aria-hidden="true"></span>
                              Confirmation de suppression
                          </h1>
                          <p>Êtes-vous sûr de vouloir supprimer tous les logs d'audit ? Cette action est irréversible.</p>
                          </div>
                          <div class="fr-modal__footer">
                              <div class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                                  <button class="fr-btn fr-btn--secondary" @click="showDeleteModal = false">Annuler</button>
                                  <button class="fr-btn fr-btn--danger" @click="deleteLogs">Confirmer la suppression</button>
                              </div>
                          </div>
                      </div>
                      </div>
                  </div>
            </div>
      </div>
    </div>
    </div>
    </div>
    
  </template>
  
  <script>
  
  import { auditService } from '@/services/audit-service';
  import logoSrc from '@/assets/logo.png'; // Assurez-vous que le chemin est correct
  import GaugeChart from '../components/GaugeChart.vue';
  
  export default {
    name: 'DashboardPage',
    components: {
      GaugeChart
    },
    data() {
      return {
        activeTab: "tabpanel-404",
        logs: [],
        filterAction: '',
        filterRoute: '',
        currentPage: 1,
        logsPerPage: 10,
        showDeleteModal: false,
  
        items: [],
        loading: true,
        error: false,
        logoSrc: logoSrc,
        totalResolved: 0,
        successRate: 0,
        selectedGeocaptcha: null,
        isModalVisible: false,
        isConfirmationModalVisible: false,
        filterOption: 'id-asc',
        apiKey: import.meta.env.VITE_API_KEY,
        apiId: import.meta.env.VITE_API_ID,
        firstObject: 1,
        nbObjects: 20,
        hasMoreData: true,
        isLoadingMore: false,
        allSessions: [],
  
        gaugeValue: 71,
        // Ajout pour la pagination des métriques
        currentMetricsPage: 1,
        metricsPerPage: 6,
      };
    },
    computed: {
      filteredLogs() {
        let filtered = this.logs;
        
        if (this.filterAction) {
          filtered = filtered.filter(log => log.action === this.filterAction);
        }
        
        if (this.filterRoute) {
          filtered = filtered.filter(log => log.route === this.filterRoute);
        }
        
        // Tri par date (du plus récent au plus ancien)
        filtered.sort((a, b) => new Date(b.rawTimestamp) - new Date(a.rawTimestamp));
        
        // Pagination
        const start = (this.currentPage - 1) * this.logsPerPage;
        const end = start + this.logsPerPage;
        
        return filtered.slice(start, end);
      },
      totalPages() {
        let filtered = this.logs;
        
        if (this.filterAction) {
          filtered = filtered.filter(log => log.action === this.filterAction);
        }
        
        if (this.filterRoute) {
          filtered = filtered.filter(log => log.route === this.filterRoute);
        }
        
        return Math.ceil(filtered.length / this.logsPerPage) || 1;
      },
      uniqueRoutes() {
        const routes = new Set();
        this.logs.forEach(log => routes.add(log.route));
        return Array.from(routes);
      },
  
      filteredItems() {
        if (this.filterOption === 'all') {
          return this.items;
        } else if (this.filterOption === 'id-asc') {
          return [...this.items].sort((a, b) => a.id.localeCompare(b.id));
        } else if (this.filterOption === 'id-desc') {
          return [...this.items].sort((a, b) => b.id.localeCompare(a.id));
        } else if (this.filterOption === 'success-asc') {
          return [...this.items].sort((a, b) => a.accuracy - b.accuracy);
        } else if (this.filterOption === 'success-desc') {
          return [...this.items].sort((a, b) => b.accuracy - a.accuracy);
        }
        return this.items;
      },
      // Ajout de la pagination pour les métriques
      paginatedItems() {
        const start = (this.currentMetricsPage - 1) * this.metricsPerPage;
        const end = start + this.metricsPerPage;
        return this.filteredItems.slice(start, end);
      },
      totalMetricsPages() {
      return Math.ceil(this.filteredItems.length / this.metricsPerPage) || 1;
      },
    },
    methods: {
      switchTab(tabId) {
        this.activeTab = tabId;
      },
      getBoxClass(action) {
        switch (action) {
          case 'CREATE': return 'box-create';
          case 'UPDATE': return 'box-update';
          case 'DELETE': return 'box-delete';
          case 'ERROR': return 'box-error';
          case 'NAVIGATE': return 'box-navigate';
          default: return 'box-info';
        }
      },
      getActionClass(action) {
        switch (action) {
          case 'CREATE': return 'action-create';
          case 'UPDATE': return 'action-update';
          case 'DELETE': return 'action-delete';
          case 'ERROR': return 'action-error';
          case 'NAVIGATE': return 'action-navigate';
          default: return 'action-info';
        }
      },
      clearFilters() {
        this.filterAction = '';
        this.filterRoute = '';
        this.currentPage = 1;
        // Réinitialiser également la page des métriques
        this.currentMetricsPage = 1;
      },
      loadLogs() {
        this.logs = auditService.getLogs();
      },
  
      confirmDeleteLogs() {
        this.showDeleteModal = true;
      },
      // Méthode pour supprimer tous les logs
      deleteLogs() {
        auditService.clearLogs();
        this.logs = [];
        this.showDeleteModal = false;
        
        // Ajouter une entrée d'audit pour la suppression
        const deleteAudit = {
          action: 'INFO',
          route: 'audit',
          description: 'Tous les logs ont été supprimés',
          timestamp: new Date().toLocaleString(),
          rawTimestamp: new Date()
        };
        
        this.logs = [deleteAudit];
        this.currentPage = 1;
      },
  
       // Méthodes pour GéoCaptcha
      // Appliquer le filtre
      applyFilter() {
        console.log("Filtre appliqué:", this.filterOption);
        // Réinitialiser la page courante lors de l'application d'un filtre
        this.currentMetricsPage = 1;
      },
  
      // Récupérer les données des géocaptchas
      async fetchData() {
    try {
      this.loading = true;
      this.error = false;
      
      // Réinitialiser les données lors d'un nouveau chargement initial
      this.allSessions = [];
      this.firstObject = 1;
      this.hasMoreData = true;
      
      // Charger toutes les sessions d'un coup
      await this.loadAllSessions();
      
    } catch (error) {
      this.error = true;
      console.error("Erreur:", error);
      
      // Ajouter une entrée d'audit en cas d'erreur
      const auditEntry = {
        action: 'ERROR',
        route: '/geocaptcha',
        description: `Erreur lors du chargement des géocaptchas: ${error.message}`,
        timestamp: new Date().toLocaleString(),
        rawTimestamp: new Date()
      };
      
      if (auditService && typeof auditService.addLog === 'function') {
        auditService.addLog(auditEntry);
      }
    } finally {
      this.loading = false;
    }
  },
  
  async loadAllSessions() {
    // Afficher un indicateur de chargement
    this.isLoadingMore = true;
    
    try {
      // Continuer à charger les données tant qu'il y en a
      while (this.hasMoreData) {
        const response = await fetch(
          `https://qlf-geocaptcha.ign.fr/api/v1/admin/session?firstObject=${this.firstObject}&nbObjects=${this.nbObjects}`,
          {
            headers: {
              "Accept": "application/json",
              "x-api-key": this.apiKey,
              "x-app-id": this.apiId
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
  
        const data = await response.json();
        
        // Si on reçoit moins de sessions que demandé, il n'y a plus de données
        if (data.sessions.length < this.nbObjects) {
          this.hasMoreData = false;
        }
        
        // Transformer les données et les ajouter à allSessions
        const newSessions = data.sessions.map(session => ({
          id: session._id,
          attempts: session.attempts,
          successes: session.success ? 1 : 0,
          failures: session.success ? 0 : 1,
          accuracy: session.success ? 100 : 0,
          challenge: session.captcha.challenge,
          ip: session.ip,
          referer: session.referer,
          createdAt: session.createdAt,
        }));
        
        // Ajouter les nouvelles sessions à notre tableau complet
        this.allSessions = [...this.allSessions, ...newSessions];
        
        // Mettre à jour l'index de la première session pour la prochaine requête
        this.firstObject += data.sessions.length;
      }
      
      // Une fois toutes les données chargées, mettre à jour items pour l'affichage
      this.items = this.allSessions;
      
      // Calculer les métriques
      this.totalResolved = this.items.reduce((total, item) => total + item.successes, 0);
      const totalAttempts = this.items.reduce((total, item) => total + item.attempts, 0);
      const totalSuccesses = this.items.reduce((total, item) => total + item.successes, 0);
      this.successRate = totalAttempts > 0 ? parseFloat(((totalSuccesses / totalAttempts) * 100).toFixed(2)) : 0;
  
      // Ajouter une entrée d'audit
      const auditEntry = {
        action: 'INFO',
        route: '/geocaptcha',
        description: `Chargement complet de ${this.allSessions.length} géocaptchas`,
        timestamp: new Date().toLocaleString(),
        rawTimestamp: new Date()
      };
      
      if (auditService && typeof auditService.addLog === 'function') {
        auditService.addLog(auditEntry);
      }
      
    } catch (error) {
      this.error = true;
      console.error("Erreur lors du chargement des sessions:", error);
      
      // Ajouter une entrée d'audit en cas d'erreur
      const auditEntry = {
        action: 'ERROR',
        route: '/geocaptcha',
        description: `Erreur lors du chargement complet des géocaptchas: ${error.message}`,
        timestamp: new Date().toLocaleString(),
        rawTimestamp: new Date()
      };
      
      if (auditService && typeof auditService.addLog === 'function') {
        auditService.addLog(auditEntry);
      }
    } finally {
      this.isLoadingMore = false;
    }
  },
  
  async loadMoreSessions() {
    if (!this.hasMoreData || this.isLoadingMore) return;
    
    try {
      this.isLoadingMore = true;
      
      const response = await fetch(
        `https://qlf-geocaptcha.ign.fr/api/v1/admin/session?firstObject=${this.firstObject}&nbObjects=${this.nbObjects}`,
        {
          headers: {
            "Accept": "application/json",
            "x-api-key": this.apiKey,
            "x-app-id": this.apiId
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }
  
      const data = await response.json();
      
      // Si on reçoit moins de sessions que demandé, il n'y a plus de données
      if (data.sessions.length < this.nbObjects) {
        this.hasMoreData = false;
      }
      
      // Transformer les données et les ajouter à allSessions
      const newSessions = data.sessions.map(session => ({
        id: session._id,
        attempts: session.attempts,
        successes: session.success ? 1 : 0,
        failures: session.success ? 0 : 1,
        accuracy: session.success ? 100 : 0,
        challenge: session.captcha.challenge,
        ip: session.ip,
        referer: session.referer,
        createdAt: session.createdAt,
      }));
      
      // Ajouter les nouvelles sessions à notre tableau complet
      this.allSessions = [...this.allSessions, ...newSessions];
      
      // Mettre à jour items pour l'affichage
      this.items = this.allSessions;
      
      // Mettre à jour l'index de la première session pour la prochaine requête
      this.firstObject += data.sessions.length;
      
      // Calculer les métriques
      this.totalResolved = this.items.reduce((total, item) => total + item.successes, 0);
      const totalAttempts = this.items.reduce((total, item) => total + item.attempts, 0);
      const totalSuccesses = this.items.reduce((total, item) => total + item.successes, 0);
      this.successRate = totalAttempts > 0 ? parseFloat(((totalSuccesses / totalAttempts) * 100).toFixed(2)) : 0;
  
      // Ajouter une entrée d'audit
      const auditEntry = {
        action: 'INFO',
        route: '/geocaptcha',
        description: `Chargement de ${newSessions.length} géocaptchas supplémentaires (total: ${this.allSessions.length})`,
        timestamp: new Date().toLocaleString(),
        rawTimestamp: new Date()
      };
      
      if (auditService && typeof auditService.addLog === 'function') {
        auditService.addLog(auditEntry);
      }
  
    } catch (error) {
      this.error = true;
      console.error("Erreur lors du chargement de sessions supplémentaires:", error);
      
      // Ajouter une entrée d'audit en cas d'erreur
      const auditEntry = {
        action: 'ERROR',
        route: '/geocaptcha',
        description: `Erreur lors du chargement des géocaptchas supplémentaires: ${error.message}`,
        timestamp: new Date().toLocaleString(),
        rawTimestamp: new Date()
      };
      
      if (auditService && typeof auditService.addLog === 'function') {
        auditService.addLog(auditEntry);
      }
    } finally {
      this.isLoadingMore = false;
    }
  },
  
  
  
      // Sélectionner un géocaptcha
      async selectGeocaptcha(item) {
        try {
          // Stocker les informations du géocaptcha sélectionné
          this.selectedGeocaptcha = item;
          this.isModalVisible = true; // Afficher le modal
          
          // Ajouter une entrée d'audit
          const auditEntry = {
            action: 'NAVIGATE',
            route: `/geocaptcha/${item.id}`,
            description: `Consultation du géocaptcha ID: ${item.id}`,
            timestamp: new Date().toLocaleString(),
            rawTimestamp: new Date()
          };
          
          if (auditService && typeof auditService.addLog === 'function') {
            auditService.addLog(auditEntry);
          }
        } catch (error) {
          console.error("Erreur lors de la sélection du géocaptcha:", error);
        }
      },
  
      getAccuracyClass(accuracy, attempts) {
        if (attempts > 30) {
          if (accuracy <= 60) {
            return "low";
          }
          else if (accuracy > 60 && accuracy <= 80) {
            return "medium";
          }
          else {
            return "high";
          }
        }
        else {
          return "not-enough-attempts";
        }
      },
  
      // Fermer le modal
      closeModal() {
        this.isModalVisible = false;
        this.selectedGeocaptcha = null;
      },
  
      // Afficher le modal de confirmation
      showConfirmationModal() {
        this.isConfirmationModalVisible = true;
      },
  
      // Fermer le modal de confirmation
      closeConfirmationModal() {
        this.isConfirmationModalVisible = false;
      },
  
      // Rejeter un géocaptcha
      async rejectGeocaptcha() {
        try {
          // Suppression de la session via l'API
          const response = await fetch(
            `https://qlf-geocaptcha.ign.fr/api/v1/admin/session/${this.selectedGeocaptcha.id}`,
            {
              method: 'DELETE',
              headers: {
                "Content-Type": "application/json",
                "x-api-key": this.apiKey,
                "x-app-id": this.apiId
              },
            }
          );
  
          if (!response.ok) {
            throw new Error("Erreur lors de la suppression du Géocaptcha");
          }
  
          // Mise à jour de la liste des géocaptchas
          this.items = this.items.filter(item => item.id !== this.selectedGeocaptcha.id);
  
          // Réactualisation des métriques
          this.totalResolved = this.items.reduce((total, item) => total + item.successes, 0);
          const totalAttempts = this.items.reduce((total, item) => total + item.attempts, 0);
          const totalSuccesses = this.items.reduce((total, item) => total + item.successes, 0);
          this.successRate = totalAttempts > 0 ? parseFloat(((totalSuccesses / totalAttempts) * 100).toFixed(2)) : 0;
  
          // Ajouter une entrée d'audit
          const auditEntry = {
            action: 'DELETE',
            route: `/geocaptcha/${this.selectedGeocaptcha.id}`,
            description: `Suppression du géocaptcha ID: ${this.selectedGeocaptcha.id}`,
            timestamp: new Date().toLocaleString(),
            rawTimestamp: new Date()
          };
          
          if (auditService && typeof auditService.addLog === 'function') {
            auditService.addLog(auditEntry);
          }
  
          // Vérifier si la page actuelle est maintenant vide (après suppression)
          if (this.paginatedItems.length === 0 && this.currentMetricsPage > 1) {
            this.currentMetricsPage--; // Revenir à la page précédente
          }
  
          // Fermeture des modaux
          this.closeModal();
          this.closeConfirmationModal();
        } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          
          // Ajouter une entrée d'audit en cas d'erreur
          const auditEntry = {
            action: 'ERROR',
            route: `/geocaptcha/${this.selectedGeocaptcha.id}`,
            description: `Erreur lors de la suppression du géocaptcha: ${error.message}`,
            timestamp: new Date().toLocaleString(),
            rawTimestamp: new Date()
          };
          
          if (auditService && typeof auditService.addLog === 'function') {
            auditService.addLog(auditEntry);
          }
        }
      },
  
      async handlePageChange(newPage) {
        this.currentMetricsPage = newPage;
  },
    },
    watch: {
      // Add watchers for the filter properties
      filterRoute() {
        this.currentPage = 1;  // Reset to page 1 when route filter changes
      },
      filterAction() {
        this.currentPage = 1;  // Reset to page 1 when action filter changes
      },
      filterOption() {
        this.currentMetricsPage = 1; // Reset metrics page when filter option changes
      }
    },
    mounted() {
      window.scrollTo(0, 0);
      this.loadLogs();
    },
    created() {
      this.loadLogs();
      this.fetchData(); 
      
      // Rafraîchir les logs toutes les 5 secondes
      this.refreshInterval = setInterval(this.loadLogs, 5000);
    },
    beforeDestroy() {
      clearInterval(this.refreshInterval);
    },
  };
  </script>
  
  <style scoped>
  
  .fr-tabs{
    margin-left: 50px;
    margin-right: 50px;
    margin-top: 170px;  
  }
  
  .fr-tabs__tab--selected {
    background-color: #007bff;
    color: white;
  }
  
  .fr-tabs__panel {
    visibility: hidden; 
    opacity: 0;
    transition: opacity 0.1s ease, visibility 0.3s ease; 
    display: none;
  }
  
  
  .fr-tabs__panel--selected {
    visibility: visible;
    opacity: 1;
    display: block;
  }
  
  .select-group-metrics {
    display: flex;
    align-items:flex-end;
    margin-bottom: 20px;
    justify-content: flex-end;
    gap: 20px;
  }
  
  .trier-metrics {
    display: flex;
    align-items: center;
    gap: 5px;
    height: 40px;  
    line-height: 40px;
  }
  
  .select-metrics{
    width: 200px; 
  }
  
  .infos {
    display: flex;
  }
  .info-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  
  .info-item.gauge {
    margin-right: 5px;
  }
  .info-item.attempts p {
    margin: 0;
    width: 100%;
  }
  
  .geocaptcha-logo {
    width: 100px; /* Ajuste la taille en fonction de tes besoins */
    height: auto;
    margin-bottom: 15px;
    object-fit: contain; /* Assure que l'image garde ses proportions */
  }
  
  .fr-input-group {
    display: flex;
    align-items: center; /* Aligner verticalement */
    width: 100%; /* S'assure que tout s'étale correctement */
  }
  
  .filtre {
    display: flex;
    align-items: center; /* Aligner verticalement */
    gap: 8px; /* Espacement entre le select et le bouton */
  }
  
  .filtre-route {
      width: 250px;
      margin-right: 10px;
  }
  
  .delete-log {
      margin-left: auto;
  }
  
  .audit-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 20px;
  }
  
  .box-audit {
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 15px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .box-create {
    border: 1px solid rgb(73, 204, 144);
    background-color: #efe;
  }
  
  .box-delete {
    border: 1px solid red;
    background-color: #fee;
  }
  
  .box-update {
    border: 1px solid rgb(97, 175, 254);
    background-color: #eef;
  }
  
  .box-error {
      border: 1px solid orange;
      background-color: #ffe;
  }
  
  .box-navigate {
    border: 1px solid purple;
    background-color: #fef;
  }
  
  .box-info {
    border: 1px solid gray;
    background-color: #f5f5f5;
  }
  
  .action-audit{
    width: 85px;
    text-align: center; 
    color: white;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 15px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  .action-create {
    background-color: rgb(73, 204, 144);
  }
  
  .action-delete {
    background-color: red;
  }
  
  .action-update {
    background-color: rgb(97, 175, 254);
  }
  
  .action-error {
    background-color: orange;
  }
  
  .action-navigate {
    background-color: purple;
  }
  
  .action-info {
    background-color: gray;
  }
  
  .route-audit {
    font-weight: bold;
      color: #333;
  }
  
  .description-audit {
    flex-grow: 1;
      color: #666;
  }
  
  .time-audit {
      margin-right: 10px;
    color: #666;
  }
  
  .fr-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  
  .pagination-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .page-info {
    font-weight: bold;
  }
  
  .fr-btn--danger {
    background-color: red;
    color: white;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
  }
  
  .fr-btn--danger:hover {
    background-color: #c82333;
  }
  
  .fr-btn--danger:disabled {
    background-color: #e99a9a;
    cursor: not-allowed;
  }
  
  /* Styles pour la modale */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .loading-indicator {
    text-align: center;
    padding: 10px;
    color: #666;
    font-style: italic;
  }
  
  .load-more-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
  
  </style>
  
    