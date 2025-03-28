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
      <!--
        <div class="search-container">
          <div class="fr-search-bar" id="search-1337" role="search">
            <label class="fr-label" for="search-1337-input">
              Rechercher
            </label>
            <input class="fr-input" aria-describedby="search-1337-input-messages" placeholder="Rechercher un GéoCaptcha via son ID" id="search-1337-input" type="search">
            <div class="fr-messages-group" id="search-1337-input-messages" aria-live="polite"></div>
            <button title="Rechercher" type="button" id="search-btn-1338" class="fr-btn">Rechercher</button>
          </div>

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
    -->
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
            <div class="fr-container">
                <div class="box-audit box-create">
                <span class="action-audit action-create">CREATE</span>
                <span class="route-audit">/key-access</span>
                <span class="description-audit">Création de l'utilsateur ID: ensg2025</span>
                <span class="time-audit">23:39 - 28/03/2025</span>
                </div>
            </div>
            <div class="fr-container">
                <div class="box-audit box-delete">
                <span class="action-audit action-delete">DELETE</span>
                <span class="route-audit">/key-access</span>
                <span class="description-audit">Suppression de l'utilsateur ID: ensg2025</span>
                <span class="time-audit">23:39 - 28/03/2025</span>
                </div>
            </div>
            <div class="fr-container">
                <div class="box-audit box-update">
                <span class="action-audit action-update">UPDATE</span>
                <span class="route-audit">/key-access</span>
                <span class="description-audit">Mise à jour de l'utilsateur ID: ensg2025</span>
                <span class="time-audit">23:39 - 28/03/2025</span>
                </div>
            </div>
        </div>


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

.action-audit{
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

</style>

  