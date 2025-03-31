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
        class="fr-tabs__panel"
        :class="{ 'fr-tabs__panel--selected': activeTab === 'tabpanel-404' }"
        role="tabpanel"
        aria-labelledby="tabpanel-404"
      > 
    </div>

      <div
        id="tabpanel-405-panel"
        class="fr-tabs__panel"
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

export default {
  name: 'DashboardPage',
  data() {
    return {
      activeTab: "tabpanel-404",
      logs: [],
      filterAction: '',
      filterRoute: '',
      currentPage: 1,
      logsPerPage: 10,
      showDeleteModal: false,
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
    }
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
  },
    mounted() {
        window.scrollTo(0, 0);
        this.loadLogs();
    },
  created() {
    this.loadLogs();
    
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
}


.fr-tabs__panel--selected {
  visibility: visible;
  opacity: 1;
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

</style>

  