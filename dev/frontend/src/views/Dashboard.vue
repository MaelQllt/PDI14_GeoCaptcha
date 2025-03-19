<template>
  <div class="dashboard">
    <h1 class="fr-h1">Dashboard</h1>
    
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
        class="fr-tabs__panel"
        :class="{ 'fr-tabs__panel--selected': activeTab === 'tabpanel-404' }"
        role="tabpanel"
        aria-labelledby="tabpanel-404"
      >
        <div class="search-container">
          <!-- Barre de recherche -->
          <div class="fr-search-bar" id="search-1337" role="search">
            <label class="fr-label" for="search-1337-input">
              Rechercher
            </label>
            <input class="fr-input" aria-describedby="search-1337-input-messages" placeholder="Rechercher un GéoCaptcha via son ID" id="search-1337-input" type="search">
            <div class="fr-messages-group" id="search-1337-input-messages" aria-live="polite"></div>
            <button title="Rechercher" type="button" id="search-btn-1338" class="fr-btn">Rechercher</button>
          </div>

          <!-- Bouton Filtrer -->
          <button @click="toggleInfo" type="button" class="fr-btn fr-icon-filter-line fr-btn--tertiary-no-outline"></button>

          <span v-if="showInfo" class="tooltip-info" role="tooltip">
            <h6 class="fr-h6">Trier:</h6>
            <fieldset class="fr-fieldset" id="checkboxes-inline" aria-labelledby="checkboxes-inline-legend checkboxes-inline-messages">
              <div class="fr-fieldset__element fr-fieldset__element--inline">
                  <div class="fr-checkbox-group fr-checkbox-group--sm">
                      <input name="checkboxes-inline-1" id="checkboxes-inline-1" type="checkbox" aria-describedby="checkboxes-inline-1-messages">
                      <label class="fr-label" for="checkboxes-inline-1">
                          Taux de Réussite
                      </label>
                      <div class="fr-messages-group" id="checkboxes-inline-1-messages" aria-live="polite">
                      </div>
                  </div>
              </div>
              <div class="fr-fieldset__element fr-fieldset__element--inline">
                  <div class="fr-checkbox-group fr-checkbox-group--sm">
                      <input name="checkboxes-inline-2" id="checkboxes-inline-2" type="checkbox" aria-describedby="checkboxes-inline-2-messages">
                      <label class="fr-label" for="checkboxes-inline-2">
                          Orde Alphabétique ID
                      </label>
                      <div class="fr-messages-group" id="checkboxes-inline-2-messages" aria-live="polite">
                      </div>
                  </div>
              </div>
              <div class="fr-fieldset__element fr-fieldset__element--inline">
                  <div class="fr-checkbox-group fr-checkbox-group--sm">
                      <input name="checkboxes-inline-3" id="checkboxes-inline-3" type="checkbox" aria-describedby="checkboxes-inline-3-messages">
                      <label class="fr-label" for="checkboxes-inline-3">
                          Autre
                      </label>
                      <div class="fr-messages-group" id="checkboxes-inline-3-messages" aria-live="polite">
                      </div>
                  </div>
              </div>
              <div class="fr-messages-group" id="checkboxes-inline-messages" aria-live="polite">
              </div>
          </fieldset>
          </span>

        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing, incididunt, ut labore et dolore magna aliqua. Vitae sapien pellentesque habitant morbi tristique senectus et. Diam maecenas sed enim ut. Accumsan lacus vel facilisis volutpat est. Ut aliquam purus sit amet luctus. Lorem ipsum dolor sit amet consectetur adipiscing elit ut.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing, incididunt, ut labore et dolore magna aliqua. Vitae sapien pellentesque habitant morbi tristique senectus et. Diam maecenas sed enim ut. Accumsan lacus vel facilisis volutpat est. Ut aliquam purus sit amet luctus. Lorem ipsum dolor sit amet consectetur adipiscing elit ut.</p>
      </div>

      <div
        id="tabpanel-405-panel"
        class="fr-tabs__panel"
        :class="{ 'fr-tabs__panel--selected': activeTab === 'tabpanel-405' }"
        role="tabpanel"
        aria-labelledby="tabpanel-405"
      >
        <p>Contenu 2</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPage',
  data() {
    return {
      activeTab: "tabpanel-404",
      showInfo: false,
    };
  },
  methods: {
    switchTab(tabId) {
      this.activeTab = tabId;
    },
    toggleInfo() {
      this.showInfo = !this.showInfo;
    },
  },
};
</script>

<style scoped>

.fr-h1 {
  margin-top: 30px;
  text-align: center;
}

.fr-tabs{
  margin-left: 50px;
  margin-right: 50px;
  
}
/* Styles des onglets sélectionnés */
.fr-tabs__tab--selected {
  background-color: #007bff;
  color: white;
}

/* Masquer les panels inactifs tout en maintenant leur espace */
.fr-tabs__panel {
  visibility: hidden; /* Utiliser visibility ou opacity pour masquer sans décalage */
  opacity: 0; /* Si tu veux rendre le panel totalement invisible sans affecter son espace */
  transition: opacity 0.1s ease, visibility 0.3s ease; /* Animation de transition */
}

/* Afficher le panel sélectionné */
.fr-tabs__panel--selected {
  visibility: visible;
  opacity: 1; /* Rendre le panel visible */
}

.search-container {
    display: flex; 
    align-items: center; 
    gap: 8px; 
    width: 100%; 
    margin-bottom: 80px;
}

.fr-search-bar {
    max-width: 400px; 
    width: 100%;
}

.tooltip-info {
  padding-left: 8px;
  border-radius: 8px;
  font-size: 12px;
  position: absolute;
  top: 33px;
  left: 480px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  z-index: 999;
}

/* Éviter que le tooltip ne dépasse du conteneur */
.tooltip-info {
  word-wrap: break-word;
  max-height: 100px;
}

.fr-h6 {
  margin-bottom: 20px;
  margin-top: 5px;
}
</style>

  