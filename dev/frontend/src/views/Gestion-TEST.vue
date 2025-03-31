<template>
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Analyse des Kingpins</h1>
      
      <div class="fr-grid-row fr-grid-row--gutters mb-6">
        <div class="fr-col-12 fr-col-md-6">
          <div class="bg-blue-50 p-4 rounded-lg shadow">
            <h2 class="text-xl font-semibold mb-2">Statistiques globales</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-white p-3 rounded shadow text-center">
                <div class="text-3xl font-bold text-blue-600">{{ totalKingpins }}</div>
                <div class="text-sm text-gray-600">Kingpins uniques</div>
              </div>
              <div class="bg-white p-3 rounded shadow text-center">
                <div class="text-3xl font-bold text-green-600">{{ totalSessions }}</div>
                <div class="text-sm text-gray-600">Sessions totales</div>
              </div>
              <div class="bg-white p-3 rounded shadow text-center">
                <div class="text-3xl font-bold" :class="successRate >= 50 ? 'text-green-600' : 'text-red-600'">
                  {{ successRate.toFixed(1) }}%
                </div>
                <div class="text-sm text-gray-600">Taux de réussite global</div>
              </div>
              <div class="bg-white p-3 rounded shadow text-center">
                <div class="text-3xl font-bold text-purple-600">{{ avgTimeGlobal.toFixed(1) }}s</div>
                <div class="text-sm text-gray-600">Temps moyen de réussite</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="fr-col-12 fr-col-md-6">
          <div class="bg-gray-50 p-4 rounded-lg shadow">
            <h2 class="text-xl font-semibold mb-2">Filtres</h2>
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Recherche par nom</label>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Rechercher un kingpin..."
                class="w-full p-2 border border-gray-300 rounded"
              >
            </div>
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Afficher uniquement</label>
              <div class="flex space-x-4">
                <label class="inline-flex items-center">
                  <input type="radio" v-model="successFilter" value="all" class="form-radio">
                  <span class="ml-2">Tous</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="successFilter" value="success" class="form-radio">
                  <span class="ml-2">Réussis</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="successFilter" value="failed" class="form-radio">
                  <span class="ml-2">Échoués</span>
                </label>
              </div>
            </div>
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tri par</label>
              <select v-model="sortSettings" class="w-full p-2 border border-gray-300 rounded">
                <option value="name-asc">Nom (A-Z)</option>
                <option value="name-desc">Nom (Z-A)</option>
                <option value="successes-desc">Réussites (décroissant)</option>
                <option value="successes-asc">Réussites (croissant)</option>
                <option value="successRate-desc">Taux de réussite (décroissant)</option>
                <option value="successRate-asc">Taux de réussite (croissant)</option>
                <option value="avgTime-asc">Temps moyen (croissant)</option>
                <option value="avgTime-desc">Temps moyen (décroissant)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Affichage en tuiles des kingpins -->
      <div class="fr-grid-row fr-grid-row--gutters">
        <div v-for="(kingpin, index) in filteredAndSortedStats" :key="index" class="fr-col-12 fr-col-md-6 fr-col-lg-4">
          <div class="fr-tile" :class="getAccuracyClass(kingpin.successRate)">
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
                    <p><strong>Sessions: </strong>{{ kingpin.total }}</p>
                  </div>
                  <div class="text-center">
                    <p><strong>Réussites: </strong>{{ kingpin.successes }}</p>
                  </div>
                </div>
                
                <div class="info-item gauge mb-2">
                  <GaugeChart :value="kingpin.successRate" min="0" max="100" label="Taux de réussite (%)" />
                </div>
                
                <div class="info-item text-center" v-if="kingpin.successes > 0">
                  <p><strong>Temps moyen: </strong>{{ kingpin.avgTime.toFixed(1) }}s</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="filteredAndSortedStats.length === 0" class="fr-col-12 text-center p-8 bg-gray-50 rounded">
          <p class="text-lg text-gray-600">Aucun kingpin ne correspond à votre recherche</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  // Composant GaugeChart pour l'affichage des jauges de précision
  const GaugeChart = {
    props: {
      value: {
        type: Number,
        required: true
      },
      min: {
        type: [Number, String],
        default: 0
      },
      max: {
        type: [Number, String],
        default: 100
      },
      label: {
        type: String,
        default: ''
      }
    },
    computed: {
      normalizedValue() {
        return Math.min(Math.max(this.value, parseInt(this.min)), parseInt(this.max));
      },
      percentage() {
        const range = parseInt(this.max) - parseInt(this.min);
        return ((this.normalizedValue - parseInt(this.min)) / range) * 100;
      },
      gaugeColor() {
        if (this.normalizedValue >= 70) return 'text-green-500';
        if (this.normalizedValue >= 40) return 'text-yellow-500';
        return 'text-red-500';
      }
    },
    template: `
      <div class="gauge-chart">
        <div class="relative pt-1">
          <div class="flex items-center justify-between mb-1">
            <div>
              <span class="text-xs font-semibold inline-block text-gray-600">
                {{ label }}
              </span>
            </div>
            <div>
              <span :class="gaugeColor" class="text-xs font-semibold inline-block">
                {{ normalizedValue.toFixed(1) }}%
              </span>
            </div>
          </div>
          <div class="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
            <div :style="{ width: percentage + '%' }" 
                 :class="gaugeColor"
                 class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-current transition-all duration-500"></div>
          </div>
        </div>
      </div>
    `
  };
  
  export default {
    name: 'KingpinTileVisualization',
    components: {
      GaugeChart
    },
    
    data() {
      return {
        kingpinData: [],
        sessionData: [],
        kingpinStats: [],
        searchQuery: '',
        successFilter: 'all',
        sortSettings: 'successRate-desc',
        logoSrc: '../assets/logo.png' // Remplacez par le chemin de votre logo
      }
    },
    
    computed: {
      sortKey() {
        return this.sortSettings.split('-')[0];
      },
      
      sortOrder() {
        return this.sortSettings.split('-')[1];
      },
      
      filteredAndSortedStats() {
        // Filtrer par recherche
        let filtered = this.kingpinStats.filter(stat => {
          return stat.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        });
        
        // Filtrer par réussite
        if (this.successFilter === 'success') {
          filtered = filtered.filter(stat => stat.successes > 0);
        } else if (this.successFilter === 'failed') {
          filtered = filtered.filter(stat => stat.successes < stat.total);
        }
        
        // Trier
        return filtered.sort((a, b) => {
          const modifier = this.sortOrder === 'asc' ? 1 : -1;
          
          if (this.sortKey === 'name') {
            return modifier * a.name.localeCompare(b.name);
          } else {
            return modifier * (a[this.sortKey] - b[this.sortKey]);
          }
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
      }
    },
    
    methods: {
      async loadData() {
        try {
          // Simulons le chargement des données JSON 
          // En production, vous utiliseriez probablement un fetch ou axios
          const gcResponse = await import('../components/FakeGC.json');
          const sessionResponse = await import('../components/FakeSession.json');
          
          this.kingpinData = gcResponse.kingpin || [];
          this.sessionData = sessionResponse.sessions || [];
          
          this.analyzeData();
        } catch (error) {
          console.error('Erreur lors du chargement des données:', error);
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
      
      getAccuracyClass(accuracy) {
        if (accuracy >= 70) return 'success-tile';
        if (accuracy >= 40) return 'warning-tile';
        return 'error-tile';
      }
    },
    
    mounted() {
      this.loadData();
    }
  }
  </script>
  
  <style scoped>
  .fr-tile {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: 0.5rem;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    margin-bottom: 1rem;
    cursor: pointer;
  }
  
  .fr-tile:hover {
    transform: translateY(-5px);
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }
  
  .fr-tile__header {
    padding: 1rem;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }
  
  .fr-tile__body {
    padding: 1rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .geocaptcha-icon {
    width: 50px;
    height: 50px;
  }
  
  .infos {
    width: 100%;
  }
  
  .success-tile {
    border-left: 4px solid #48bb78;
  }
  
  .warning-tile {
    border-left: 4px solid #ecc94b;
  }
  
  .error-tile {
    border-left: 4px solid #f56565;
  }
  </style>