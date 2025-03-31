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
            Logs
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
      
      <h6 class="fr-h6">Heatmap affichant la localisation des GéoCaptchas créés :</h6>
      <Heatmap :geocaptchaData="kingpinStats" />

      <div class="select-group-metrics">
        <div class="fr-search-bar">
          <input
            class="fr-input"
            placeholder="Rechercher"
            type="search"
            v-model="searchQuery"
          />
          <button title="Rechercher" type="button" class="fr-btn">Rechercher</button>
        </div>
        <div class="filter-tags">
          <ul class="fr-tags-group">
            <li>
              <button
                class="fr-tag"
                :class="{ 'fr-tag--selected': selectedTag === 'all', 'fr-tag--checked': selectedTag === 'all' }"
                :aria-pressed="selectedTag === 'all'"
                @click="setFilter('all')"
              >
                Tous
              </button>
            </li>
            <li>
              <button
                class="fr-tag"
                :class="{ 'fr-tag--selected': selectedTag === 'success', 'fr-tag--checked': selectedTag === 'success' }"
                :aria-pressed="selectedTag === 'success'"
                @click="setFilter('success')"
              >
                Réussis
              </button>
            </li>
            <li>
              <button
                class="fr-tag"
                :class="{ 'fr-tag--selected': selectedTag === 'failed', 'fr-tag--checked': selectedTag === 'failed' }"
                :aria-pressed="selectedTag === 'failed'"
                @click="setFilter('failed')"
              >
                Échoués
              </button>
            </li>
          </ul>
        </div>


        <div class="trier-metrics">
          <label class="fr-label" for="filter-select">
            <span class="fr-icon-filter-line fr-icon--sm" aria-hidden="true"></span>
            <span class="trier-text">Trier</span>
          </label>
          <select class="fr-select select-metrics" aria-describedby="select-messages" id="filter-select" v-model="sortKey" @change="sortOrder = 'desc'">
            <option value="name">Nom</option>
            <option value="successRate">Taux de réussite</option>
            <option value="attempts">Nombre d'essais</option>
          </select>
          <button class="fr-icon-arrow-up-down-line " @click="toggleSortOrder"></button>
        </div>
        
      </div>



    </div>
  </div>

  <div class="fr-grid-row fr-grid-row--gutters">
    <div v-for="(kingpin, index) in filteredAndSortedStats" :key="index" class="fr-col-12 fr-col-md-6 fr-col-lg-4">
      <div class="fr-tile" :class="getAccuracyClass(kingpin.successRate)" @click="openKingpinModal(kingpin)">
        <div class="fr-tile__header">
          <p><strong class="fr-tile__title">Nom: </strong> {{ kingpin.name }}</p>
        </div>
        <div class="fr-tile__body">
          <div class="geocaptcha-icon bg-gray-100 rounded-full p-2 flex items-center justify-center mb-4">
            <span class="text-2xl">🧩</span> <!-- Emoji placeholder for logo -->
          </div>
          
          <div class="infos">
            <div class="info-item grid grid-cols-2 gap-4 mb-4">
              <div class="text-center">
                <p><strong>Nombre d'essais : </strong>{{ kingpin.total }}</p>
              </div>
            </div>
            
            <div class="info-item gauge mb-2">
              <GaugeChart :value="Math.round(kingpin.successRate)" min="0" max="100" label="Taux de réussite (%)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="filteredAndSortedStats.length === 0" class="fr-col-12 text-center p-8 bg-gray-50 rounded">
      <p class="text-lg text-gray-600">Aucun kingpin ne correspond à votre recherche</p>
    </div>
  </div>


          <!-- Modal pour Détails du Géocaptcha -->
          <div v-if="isModalVisible" class="modal-overlay">
            <div class="fr-container fr-container--fluid fr-container-md">
              <div class="fr-grid-row fr-grid-row--center">
                <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
                  <div class="fr-modal__body">
                    <div class="fr-modal__header">
                      <button @click="closeModal" class="fr-btn--close fr-btn">Fermer</button>
                    </div>
                    <div class="fr-modal__content">
                      <h2 id="modal-6053-title" class="fr-modal__title">
                        <span class="fr-icon-arrow-right-line fr-icon--lg" aria-hidden="true"></span>
                        Détails du Géocaptcha
                      </h2>
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
                      <button @click="closeConfirmationModal" class="fr-btn--close fr-btn">Fermer</button>
                    </div>
                    <div class="fr-modal__content">
                      <h2 id="modal-6053-title" class="fr-modal__title">
                        <span class="fr-icon-warning-line fr-icon--lg" aria-hidden="true"></span>
                        Confirmation
                      </h2>
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
      <h1>Logs</h1>

      <div class="audit-container">
        <div class="fr-container">
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
import Heatmap from '../components/Heatmap.vue';

export default {
  name: 'DashboardPage',
  components: {
    GaugeChart,
    Heatmap,
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

      kingpinData: [],
      sessionData: [],
      kingpinStats: [],
      searchQuery: '',
      sortKey: 'name', 
      sortOrder: 'asc',
      selectedTag: 'all',
      selectedTags: new Set(),
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
    filteredAndSortedStats() {
    let filtered = this.kingpinStats.filter(stat => {
      console.log("Filtrage par nom:", stat.name, this.searchQuery);
      return stat.name.toLowerCase().includes(this.searchQuery.toLowerCase());
    });

    if (this.selectedTag === 'success') {
      filtered = filtered.filter(stat => stat.successRate > 70);
    } else if (this.selectedTag === 'failed') {
      filtered = filtered.filter(stat => stat.successRate <= 50);
    }

    console.log("Données filtrées:", filtered);

    return filtered.sort((a, b) => {
      const modifier = this.sortOrder === 'asc' ? 1 : -1;

      if (this.sortKey === 'name') {
        return modifier * a.name.localeCompare(b.name);
      } else if (this.sortKey === 'successRate') {
        return modifier * (a.successRate - b.successRate);
      } else if (this.sortKey === 'attempts') {
        return modifier * (a.attempts - b.attempts);
      }
      return 0;
    });
  },
  
  totalKingpins() {
    return this.kingpinStats.length;
  },
  
  totalSessions() {
    return this.kingpinStats.reduce((sum, stat) => sum + stat.total, 0);
  },

    successRate() {
        const totalSuccesses = this.kingpinStats.reduce((sum, stat) => sum + stat.successes, 0);
        return this.totalSessions > 0 ? (totalSuccesses / this.totalSessions) * 100 : 0;
      },
      
      avgTimeGlobal() {
        let totalTime = 0;
        let totalSuccesses = 0;
        
        this.kingpinStats.forEach(stat => {
          totalTime += stat.totalTime;
          totalSuccesses += stat.successes;
        });
        
        return totalSuccesses > 0 ? totalTime / totalSuccesses : 0;
      },
      
  },
  methods: {

    openKingpinModal(kingpin) {
    this.selectedGeocaptcha = {
      id: kingpin.name, // Utilisez un identifiant unique si disponible
      ip: 'N/A', // Remplacez par les données réelles si disponibles
      attempts: kingpin.total,
      successes: Math.round(kingpin.successRate * kingpin.total / 100),
      failures: kingpin.total - Math.round(kingpin.successRate * kingpin.total / 100),
      accuracy: kingpin.successRate,
      referer: 'N/A', // Remplacez par les données réelles si disponibles
      createdAt: 'N/A', // Remplacez par les données réelles si disponibles
      challenge: {
        backendId: 'N/A', // Remplacez par les données réelles si disponibles
        frontendId: 'N/A' // Remplacez par les données réelles si disponibles
      }
    };
    this.isModalVisible = true;
  },
    toggleTagSelection(tag) {
    if (this.selectedTags.has(tag)) {
      this.selectedTags.delete(tag);
    } else {
      this.selectedTags.add(tag);
    }
  },
    switchTab(tabId) {
      this.activeTab = tabId;
    },

    async loadData(firstSessionObject = 1, firstKingpinObject = 1) {
    try {
      // Récupération des données de session
      const sessionResponse = await fetch(
        `https://qlf-geocaptcha.ign.fr/api/v1/admin/session?firstObject=${firstSessionObject}&nbObjects=20`,
        {
          headers: {
            "Accept": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
            "x-app-id": import.meta.env.VITE_API_ID,
          },
        }
      );

      if (!sessionResponse.ok) {
        const errorText = await sessionResponse.text();
        console.error('Erreur API session:', sessionResponse.status, errorText);
        throw new Error(`Erreur réseau (session): ${sessionResponse.status} - ${sessionResponse.statusText}`);
      }

      const sessionData = await sessionResponse.json();
      const newSessions = sessionData.sessions || [];

      // Ajouter les nouvelles sessions aux données existantes
      this.sessionData = [...this.sessionData, ...newSessions];

      // Si le nombre de sessions récupérées est égal à 20, appeler récursivement pour récupérer la prochaine page
      if (newSessions.length === 20) {
        await this.loadData(firstSessionObject + 20, firstKingpinObject);
      } else {
        console.log("Toutes les sessions ont été récupérées.");

        // Récupération des données kingpin
        const kingpinResponse = await fetch(
          `https://qlf-geocaptcha.ign.fr/api/v1/admin/kingpin?firstObject=${firstKingpinObject}&nbObjects=20`,
          {
            headers: {
              "Accept": "application/json",
              "x-api-key": import.meta.env.VITE_API_KEY,
              "x-app-id": import.meta.env.VITE_API_ID,
            },
          }
        );

        if (!kingpinResponse.ok) {
          const errorText = await kingpinResponse.text();
          console.error('Erreur API kingpin:', kingpinResponse.status, errorText);
          throw new Error(`Erreur réseau (kingpin): ${kingpinResponse.status} - ${kingpinResponse.statusText}`);
        }

        const kingpinData = await kingpinResponse.json();
        const newKingpins = kingpinData.kingpin || [];

        // Ajouter les nouveaux kingpins aux données existantes
        this.kingpinData = [...this.kingpinData, ...newKingpins];

        // Si le nombre de kingpins récupérés est égal à 20, appeler récursivement pour récupérer la prochaine page
        if (newKingpins.length === 20) {
          await this.loadData(firstSessionObject, firstKingpinObject + 20);
        } else {
          console.log("Tous les kingpins ont été récupérés.");

          // Analyse des données récupérées
          this.analyzeData();
        }
      }

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      this.errorMessage = `Erreur: ${error.message}`;
      this.isError = true;
    }
  },
      
      
      analyzeData() {
        // Créer un mapping des kingpins par nom
        const kingpinsByName = {};
        this.kingpinData.forEach(kingpin => {
          if (!kingpinsByName[kingpin.name]) {
            kingpinsByName[kingpin.name] = [];
          }
          kingpinsByName[kingpin.name].push(kingpin);
        });
        
        // Analyser les sessions pour chaque kingpin
        const statsMap = {};
        
        this.sessionData.forEach(session => {
          const kingpinName = session.captcha?.challenge?.name;
          
          if (!kingpinName) return;
          
          if (!statsMap[kingpinName]) {
            statsMap[kingpinName] = {
              name: kingpinName,
              total: 0,
              successes: 0,
              totalTime: 0,
              avgTime: 0,
              successRate: 0,
              attempts: 0
            };
          }
          
          const stats = statsMap[kingpinName];
          stats.total++;
          stats.attempts += session.attempts || 0;
          
          if (session.success) {
            stats.successes++;
            
            // Calculer le temps en secondes
            if (session.begin && session.end) {
              const beginTime = new Date(session.begin);
              const endTime = new Date(session.end);
              const durationInSeconds = Math.abs((endTime - beginTime) / 1000);
              
              stats.totalTime += durationInSeconds;
            }
          }
        });
        
        // Calculer les moyennes et taux
        Object.values(statsMap).forEach(stats => {
          stats.successRate = stats.total > 0 ? (stats.successes / stats.total) * 100 : 0;
          stats.avgTime = stats.successes > 0 ? stats.totalTime / stats.successes : 0;
          stats.avgAttempts = stats.total > 0 ? stats.attempts / stats.total : 0;
        });
        
        this.kingpinStats = Object.values(statsMap);
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
    },

    setFilter(tag) {
    this.selectedTag = tag;
    this.filterOption = tag;
  },
    toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  },

    // Récupérer les données des géocaptchas
    async fetchData() {
    try {
      const response = await fetch(
        `https://qlf-geocaptcha.ign.fr/api/v1/admin/session?firstObject=1&nbObjects=20`,
        {
          headers: {
            "Accept": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
            "x-app-id": import.meta.env.VITE_API_ID,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      const data = await response.json();
      console.log("Données récupérées de l'API:", data); // Vérifiez les données récupérées

      // Accédez à data.sessions pour itérer sur les sessions
      const sessions = data.sessions;

      // Regrouper les sessions par challengeId
      const aggregatedData = {};
      sessions.forEach(session => {
        const challengeId = session.challengeId;
        if (!aggregatedData[challengeId]) {
          aggregatedData[challengeId] = {
            id: session._id,
            attempts: 0,
            successes: 0,
            failures: 0,
            accuracy: 0,
            challenge: session.captcha.challenge,
            ip: session.ip,
            referer: session.referer,
            createdAt: session.createdAt,
          };
        }
        aggregatedData[challengeId].attempts += session.attempts;
        if (session.success) {
          aggregatedData[challengeId].successes++;
        } else {
          aggregatedData[challengeId].failures++;
        }
        aggregatedData[challengeId].accuracy = (aggregatedData[challengeId].successes / aggregatedData[challengeId].attempts) * 100;
      });

      // Convertir l'objet agrégé en tableau
      this.items = Object.values(aggregatedData);
      console.log("Données agrégées:", this.items); // Vérifiez les données agrégées

      // Calculer les métriques
      this.totalResolved = this.items.reduce((total, item) => total + item.successes, 0);
      const totalAttempts = this.items.reduce((total, item) => total + item.attempts, 0);
      const totalSuccesses = this.items.reduce((total, item) => total + item.successes, 0);
      this.successRate = totalAttempts > 0 ? parseFloat(((totalSuccesses / totalAttempts) * 100).toFixed(2)) : 0;

      // Ajouter une entrée d'audit
      const auditEntry = {
        action: 'INFO',
        route: '/geocaptcha',
        description: `Chargement de ${this.items.length} géocaptchas`,
        timestamp: new Date().toLocaleString(),
        rawTimestamp: new Date()
      };

      if (auditService && typeof auditService.addLog === 'function') {
        auditService.addLog(auditEntry);
      }

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
              "x-api-key": import.meta.env.VITE_API_KEY,
              "x-app-id": import.meta.env.VITE_API_ID,
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
  },
  watch: {
    // Add watchers for the filter properties
    filterRoute() {
      this.currentPage = 1;  // Reset to page 1 when route filter changes
    },
    filterAction() {
      this.currentPage = 1;  // Reset to page 1 when action filter changes
    }
  },
  mounted() {
    window.scrollTo(0, 0);
    this.loadLogs();
    this.loadData();
    //this.fetchData(); 
  },
  created() {
    this.loadLogs();
    this.loadData();
    //this.fetchData(); 
    
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
  align-items: flex-end; 
  margin-bottom: 20px;
  justify-content: space-between;
}

.fr-search-bar {
  display: flex;
  align-items: center; /* Centrer verticalement les éléments dans la barre de recherche */
  width: 250px; /* Largeur fixe pour la barre de recherche */
  height: 40px;
}


.trier-metrics {
  display: flex;
  align-items: center; /* Aligner verticalement les éléments au centre */
  gap: 10px;
  height: 50px;
}

.trier-metrics .fr-label {
  display: flex;
  align-items: center; /* Aligner verticalement les éléments au centre */
  gap: 5px; /* Espacement entre l'icône et le texte */
}

.fr-icon-filter-line {
  height: 17px; /* Espacement entre l'icône et le texte */
}

.fr-icon-arrow-up-down-line {
  height: 17px;
}

.trier-text{
  height: 17px;
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
  margin-bottom: 20px; /* Espacement entre le groupe d'input et le reste du contenu */
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

:root[data-fr-theme="dark"] .box-create {
  border: 1px solid rgb(73, 204, 144);
  background-color: rgba(73, 204, 144, 0.1);
  color: #e0e0e0;
}

:root[data-fr-theme="dark"] .box-delete {
  border: 1px solid #ff6b6b;
  background-color: rgba(255, 0, 0, 0.2);
  color: #e0e0e0;
}

:root[data-fr-theme="dark"] .box-update {
  border: 1px solid rgb(97, 175, 254);
  background-color: rgba(97, 175, 254, 0.2);
  color: #e0e0e0;
}

:root[data-fr-theme="dark"] .box-error {
  border: 1px solid orange;
  background-color: rgba(255, 165, 0, 0.2);
  color: #e0e0e0;
}

:root[data-fr-theme="dark"] .box-navigate {
  border: 1px solid #c183ff;
  background-color: rgba(128, 0, 128, 0.2);
  color: #e0e0e0;
}

:root[data-fr-theme="dark"] .box-info {
  border: 1px solid #aaa;
  background-color: #333;
  color: #e0e0e0;
}

:root[data-fr-theme="dark"] .route-audit {
  font-weight: bold;
  color: #e0e0e0;
}

:root[data-fr-theme="dark"] .description-audit {
  flex-grow: 1;
  color: #cfcfcf;
}

:root[data-fr-theme="dark"] .time-audit {
  margin-right: 10px;
  color: #cfcfcf;
}

.fr-tag--checked {
  position: relative;
}

.fr-tag--checked::after {
  content: '✔';
  position: absolute;
  top: 0;
  right: 0;
  padding: 2px;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
}



</style>

  