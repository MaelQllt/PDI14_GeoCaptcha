<template> 
    <div class="fr-tabs">
      <!-- Liste des onglets -->
      <ul class="fr-tabs__list" role="tablist" aria-label="Navigation des onglets">
        <li role="presentation">
          <button
            id="tabpanel-404"
            class="fr-tabs__tab fr-icon-group-line fr-tabs__tab--icon-left"
            :class="{ 'fr-tabs__tab--selected': activeTab === 'tabpanel-404' }"
            role="tab"
            :aria-selected="activeTab === 'tabpanel-404'"
            aria-controls="tabpanel-404-panel"
            @click="switchTab('tabpanel-404')"
          >
            Liste des utilisateurs
          </button>
        </li>
        <li role="presentation">
          <button
            id="tabpanel-405"
            class="fr-tabs__tab fr-icon-user-add-line fr-tabs__tab--icon-left"
            :class="{ 'fr-tabs__tab--selected': activeTab === 'tabpanel-405' }"
            role="tab"
            :aria-selected="activeTab === 'tabpanel-405'"
            aria-controls="tabpanel-405-panel"
            @click="switchTab('tabpanel-405')"
          >
            Générer une clé d'accès
          </button>
        </li>
      </ul>

      <!-- Contenus des onglets -->

      <!-- Onglet Liste des utilisateurs-->
      <div
        id="tabpanel-404-panel"
        class="fr-tabs__panel"
        :class="{ 'fr-tabs__panel--selected': activeTab === 'tabpanel-404' }"
        role="tabpanel"
        aria-labelledby="tabpanel-404"
      >
        <div class="key-list">
          <div class="barre">
            <h1>Liste des utilisateurs</h1>
            <div class="search-container">
              <div class="tag-container">
                <ul class="fr-tags-group">
                  <li>
                    <button class="fr-tag" :class="{ 'fr-tag--selected': selectedTag === 'admin' }" :aria-pressed="(selectedTag === 'admin').toString()" type="button" @click="toggleTag('admin')">
                      Admin
                    </button>
                  </li>
                  <li>
                    <button class="fr-tag" :class="{ 'fr-tag--selected': selectedTag === 'private' }" :aria-pressed="(selectedTag === 'private').toString()" type="button" @click="toggleTag('private')">
                      Private
                    </button>
                  </li>
                </ul>
              </div>
              <div class="tooltip-container">
                <button @mouseover="showTooltip" @mouseleave="hideTooltip" class="fr-btn--tertiary-no-outline fr-icon-information-line"></button>
                <span v-if="isTooltipVisible" class="custom-tooltip">
                  Vous pouvez rechercher via le nom, l'adresse mail ou le referer.
                </span>
              </div>
              <div class="fr-search-bar">
                <input
                  class="fr-input"
                  placeholder="Rechercher"
                  type="search"
                  v-model="searchQuery"
                />
                <button title="Rechercher" type="button" class="fr-btn"> Rechercher </button>
              </div>
            </div>
          </div>
          <div class="fr-grid-row fr-grid-row--gutters">
            <div
              v-for="(key, index) in filteredKeys"
              :key="index"
              class="fr-col-12 fr-col-md-6 fr-col-lg-4"
            >
              <div class="fr-tile">
                <div class="fr-tile__header">
                  <p><strong class="fr-tile__title">Nom : </strong>{{ key.appId }}</p>
                  <p><strong class="fr-tile__title">Adresse mail : </strong>{{ key.email }}</p>
                  <p><strong class="fr-tile__title">Referer : </strong>{{ key.referer }}</p>
                  <p><strong class="fr-tile__title">Rôle : </strong>{{ key.role }}</p>
                </div>
                <div class="fr-tile__body">
                  <button type="button" class="delete-btn fr-btn fr-btn--sm" @click="openModal(key.appId)">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>

          

          <!-- Pagination pour visualiser tous les utilisateurs-->
          <div class="pagination" v-if="totalPages > 1">
            <button 
              @click="prevPage" 
              type="button"
              :disabled="currentPage === 1" 
              class="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-left-s-line"
            >
            </button>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages" 
              class="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-right-s-line"
            >
            </button>
          </div>

          <!-- Message si la liste des clés est vide -->
          <div v-if="filteredKeys.length === 0" class="fr-alert fr-alert--error">
            Aucune clé d'accès trouvée.
          </div>

        </div>

        <!-- Modal de confirmation de suppression -->
        <div v-if="showModal" class="modal-overlay">
          <div class="fr-container fr-container--fluid fr-container-md">
            <div class="fr-grid-row fr-grid-row--center">
              <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
                <div class="fr-modal__body">
                  <div class="fr-modal__header">
                    <h2 class="fr-modal__title">
                      <span class="fr-icon-warning-line fr-icon--lg" aria-hidden="true"></span>
                      Confirmation de suppression
                    </h2>
                    <button @click="closeModal" class="fr-btn--close fr-btn" id="close">Fermer</button>
                  </div>
                  <div class="fr-modal__content">
                    <p>Êtes-vous sûr de vouloir supprimer cette clé ?</p>
                  </div>
                  <div class="fr-modal__footer fr-btns-group--right fr-btns-group--inline-lg fr-btns-group--icon-left">
                    <button @click="deleteKey" class="fr-btn fr-btn--reject">Oui, supprimer</button>
                    <button @click="closeModal" class="fr-btn fr-btn--cancel" id="cancel">Annuler</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglet Générer une clé d'accès -->
      <div
        id="tabpanel-405-panel"
        class="fr-tabs__panel"
        :class="{ 'fr-tabs__panel--selected': activeTab === 'tabpanel-405' }"
        role="tabpanel"
        aria-labelledby="tabpanel-405"
      >
        <div class="main-content">
          <div class="key-generation">
          <h1 class="fr-h1">Générer une clé d'accès</h1>
          <form @submit.prevent="openConfirmationModal">

            <div class="fr-input-group">
              <label class="fr-label" for="key-name">Nom :</label>
              <input
                type="text"
                id="key-name"
                v-model="keyName"
                class="fr-input"
                placeholder="Nom associé à la clé d'accès (minimum 5 caractères)"
                minlength="5"
                required
              />
            </div>


            <div class="fr-input-group">
              <label class="fr-label" for="email">Adresse mail associée :</label>
              <input type="email" id="email" v-model="email" class="fr-input" placeholder="exemple@xyz.fr" required/>
            </div>

            <div class="fr-input-group">
              <label class="fr-label" for="key-referer">Referer :</label>
              <input
                type="text"
                id="key-referer"
                v-model="referer"
                class="fr-input"
                placeholder="Exemple : http(s)://application-client1.eu"
                @input="validateReferer"
                required
              />
              <span v-if="referer && !isValidReferer" class="fr-error">Le format de l'URL est incorrect. Exemple : http(s)://application-client1.eu</span>
            </div>


            <div class="fr-select-group">
              <label class="fr-label" for="select">Rôle :</label>
              <select id="select" name="select" v-model="role" class="fr-select" required>
                <option value="" disabled selected hidden>Choisissez un rôle</option>
                <option value='admin'>Admin</option>
                <option value='private'>Private</option>
              </select>
            </div>

            <button type="submit" class="fr-btn fr-btn--primary cle-generer">Générer la clé</button>
          </form>
          </div>

          <!-- Modal de confirmation de génération -->
          <div v-if="showConfirmationModal" class="modal-overlay">
            <div class="fr-container fr-container--fluid fr-container-md">
              <div class="fr-grid-row fr-grid-row--center">
                <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
                  <div class="fr-modal__body">
                    <div class="fr-modal__header">
                      <button @click="generateApiKey" aria-controls="modal-6053" title="Fermer" type="button" id="button-6054" class="fr-btn--close fr-btn">Fermer</button>
                    </div>
                    <div class="fr-modal__content">
                      <h1 id="modal-6053-title" class="fr-modal__title">
                        <span class="fr-icon-check-line fr-icon--lg" aria-hidden="true"></span>
                        Clé Générée
                      </h1>
                      <p>La clé a été générée avec succès. Un mail sera envoyé à l'adresse renseignée dans les plus brefs délais.</p>
                    </div>
                    <div class="fr-modal__footer">
                        <div class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                          <button @click="generateApiKey" type="button" id="button-6047" class="validate-btn fr-btn fr-icon-checkbox-circle-line fr-btn--icon-left">Valider</button>
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
export default {
  data() {
    return {
      activeTab: "tabpanel-404",
      keyName: "",
      email: "",
      referer: "",
      isValidReferer: true,
      role: "",
      apiKeys: [],
      searchQuery: "",
      showModal: false, // Contrôle l'affichage du modal de suppression
      keyToDelete: null, // Stocke l'ID de la clé à supprimer
      showConfirmationModal: false, // Contrôle l'affichage du modal de confirmation pour la génération de clé
      showMissingInfoModal: false, // Contrôle l'affichage du modal si l'utilisateur n'a pas rempli les infos
      apiKey : import.meta.env.VITE_API_KEY,
      apiId : import.meta.env.VITE_API_ID,
      firstObject: 1,
      nbObjects: 20,
      currentPage: 1,
      totalKeys: 0,
      itemsPerPage: 6,
      isTooltipVisible: false,
      selectedTag: "",
    };
  },
  computed: {
    filteredKeys() {
      const filtered = this.apiKeys.filter(key => {
        const searchQueryLower = this.searchQuery.toLowerCase();
        
        const appIdMatch = key.appId && key.appId.toLowerCase().includes(searchQueryLower);
        const emailMatch = key.email && key.email.toLowerCase().includes(searchQueryLower);
        const refererMatch = key.referer && key.referer.toLowerCase().includes(searchQueryLower);

        const matchesTag = this.selectedTag === "" || key.role === this.selectedTag;

        return (appIdMatch || emailMatch || refererMatch) && matchesTag;
      });

      // Pagination
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return filtered.slice(start, end);
    },
    totalPages() {
      // Calculate total pages based on filtered keys
      const filtered = this.apiKeys.filter(key => {
        const searchQueryLower = this.searchQuery.toLowerCase();
        
        const appIdMatch = key.appId && key.appId.toLowerCase().includes(searchQueryLower);
        const emailMatch = key.email && key.email.toLowerCase().includes(searchQueryLower);
        const refererMatch = key.referer && key.referer.toLowerCase().includes(searchQueryLower);

        const matchesTag = this.selectedTag === "" || key.role === this.selectedTag;

        return (appIdMatch || emailMatch || refererMatch) && matchesTag;
      });

      return Math.ceil(filtered.length / this.itemsPerPage);
    }
  },
  methods: {

    switchTab(tabId) {
      this.activeTab = tabId;
      this.fetchKeys();
    },

    validateReferer() {
    const regex = /^(https?:\/\/)[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\/?\s*$/;
    this.isValidReferer = regex.test(this.referer);
    },
    // Ouvrir le modal et définir la clé à supprimer
    openModal(id) {
      this.keyToDelete = id;
      this.showModal = true;
    },

    // Fermer le modal sans effectuer de suppression
    closeModal() {
      this.showModal = false;
      this.keyToDelete = null;
    },

    // Ouvrir le modal de confirmation pour générer une clé
    openConfirmationModal() {
      if (!this.keyName || !this.email || !this.isValidReferer) {
        this.showMissingInfoModal = true; // Affiche le modal d'erreur si les champs sont vides
        return;
      }
      this.showConfirmationModal = true; // Affiche le modal de confirmation
    },

    // Fermer le modal de confirmation pour générer une clé
    closeConfirmationModal() {
      this.showConfirmationModal = false; // Ferme le modal de confirmation
    },

    // Fermer le modal si l'utilisateur n'a pas rempli les champs
    closeMissingInfoModal() {
      this.showMissingInfoModal = false; // Ferme le modal d'erreur
    },

    showTooltip() {
      this.isTooltipVisible = true;
    },

    hideTooltip() {
      this.isTooltipVisible = false;
    },

    toggleTag(role) {
      // Si on clique sur le tag déjà actif, on le désactive
      this.selectedTag = this.selectedTag === role ? "" : role;
      this.currentPage = 1;
    },

    // Méthode pour générer une nouvelle clé d'accès
    async generateApiKey() {
      try {
        const response = await fetch("https://qlf-geocaptcha.ign.fr/api/v1/admin/cuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey,
            "x-app-id": this.apiId
          },
          body: JSON.stringify({
            appId: this.keyName,
            email: this.email,
            referer: this.referer,
            role: this.role
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur HTTP : ${response.status} - ${errorText}`);
        }

        const responseData = await response.json();
        
        // Log détaillé de la réponse
        console.log('Réponse complète :', responseData);

        // Extraction de la clé depuis l'objet cuser
        const generatedApiKey = responseData.cuser?.key || 
                                responseData.cuser?.apiKey || 
                                responseData.cuser?.access_key;

        if (!generatedApiKey) {
          console.error('Aucune clé trouvée dans cuser', responseData.cuser);
          throw new Error('Impossible de trouver la clé API dans la réponse');
        }

        const subject = encodeURIComponent("Votre nouvelle clé d'accès");
        const body = encodeURIComponent(`Bonjour,

Voici votre nouvelle clé d'accès :

Nom : ${this.keyName}
Clé : ${generatedApiKey}

Veuillez la conserver de manière sécurisée.

Cordialement,
Votre service CaptchAdmin`);

        window.location.href = `mailto:${this.email}?subject=${subject}&body=${body}`;

        await this.fetchKeys();
        
        // Réinitialisation des champs
        this.keyName = "";
        this.email = "";
        this.referer = "";
        this.role = "";
        this.showConfirmationModal = false;

      } catch (error) {
        console.error("Erreur lors de la génération de la clé", error);
        this.errorMessage = error.message || "Une erreur est survenue lors de la génération de la clé.";
      }
    },

    // Méthode pour supprimer la clé d'accès après confirmation
    async deleteKey() {  // Retirez le paramètre id de la fonction
      const id = this.keyToDelete;  // Utilisez l'ID stocké dans keyToDelete
      if (!id) return;

      try {
        const response = await fetch(`https://qlf-geocaptcha.ign.fr/api/v1/admin/cuser/${id}`,
            { method: "DELETE",
                  headers: {
                  "Accept": "*/*",
                  "x-api-key": this.apiKey,
                  "x-app-id": this.apiId
                }});

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de la clé.");
        }

        await  this.fetchKeys();  // Recharge la liste après suppression
        this.closeModal();  // Ferme le modal après suppression
      } catch (error) {
        console.error("Erreur:", error);
      }
    },

    // New pagination methods
    prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  },
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  },

  // Ajoutez cette nouvelle méthode pour récupérer les clés supplémentaires
  async fetchMoreKeys() {
    try {
      const response = await fetch(
        `https://qlf-geocaptcha.ign.fr/api/v1/admin/cuser?firstObject=21&nbObjects=20`,
        {
          headers: {
            "Accept": "application/json",
            "x-api-key": this.apiKey,
            "x-app-id": this.apiId
          },
        }
      );
      const resultat = await response.json();
      const additionalKeys = JSON.parse(JSON.stringify(resultat.cusers)) || [];
      
      // Ajouter les clés supplémentaires à la liste existante
      this.apiKeys = [...this.apiKeys, ...additionalKeys];
      this.totalKeys = this.apiKeys.length;
    } catch (error) {
      console.error("Erreur lors de la récupération des clés supplémentaires", error);
    }
  },

  async fetchKeys() {
    try {
      const response = await fetch(
        `https://qlf-geocaptcha.ign.fr/api/v1/admin/cuser?firstObject=1&nbObjects=20`,
        {
          headers: {
            "Accept": "application/json",
            "x-api-key": this.apiKey,
            "x-app-id": this.apiId
          },
        }
      );
      const resultat = await response.json();
      this.apiKeys = JSON.parse(JSON.stringify(resultat.cusers)) || [];
      this.totalKeys = this.apiKeys.length;

      // Si moins de 20 clés, pas besoin de chercher plus
      if (this.apiKeys.length === 20) {
        await this.fetchMoreKeys();
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des clés", error);
    }
  },
},
  mounted() {
    window.scrollTo(0, 0);
    this.fetchKeys(); // Appel de la méthode pour récupérer les clés dès le chargement de la page
  },

  watch: {
    // Reset to first page when search query changes
    searchQuery() {
      this.currentPage = 1;
    }
  }
};
</script>

<style scoped>

/* Styles des onglets à sélectionner */
.fr-tabs__tab--selected {
  background-color: #007bff;
  color: white;
}


/* Style d'affichage es utilisateurs */
.fr-table{
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 15px;
  margin-bottom: 1em;  
}

.fr-table th, .fr-table td{
  padding: 0.5em;
  border-bottom: 2px solid #000000;
}

.table-contour{
  outline: 1px solid #d2d2d2;
}

.fr-tabs{
  margin-left: 50px;
  margin-right: 50px;
  margin-top: 170px;  
}

/* Masquer les panels inactifs tout en maintenant leur espace */
.fr-tabs__panel {
  visibility: hidden; 
  opacity: 0; 
  transition: opacity 0.1s ease, visibility 0.3s ease; 
  height: auto !important;
  display: none;
}

/* Afficher le panel sélectionné */
.fr-tabs__panel--selected {
  visibility: visible;
  display: block; 
  opacity: 1; 
}


/* Styles pour la recherche d'utilisateur */
.key-list {
  margin: 1em;
}

.barre {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
}

.barre h1 {
  margin: 0;
}

/* Styles des boutons */

#close{
  background: none;
  border: none;
  color: #000;
  cursor: pointer;
}

#close:hover {
  color: #3a3a3a !important;
}


.fr-btn--reject {
        background-color: #ff4140; 
        color: #fff; 
    }

    .fr-btn--reject:hover {
        background-color: #ce0500; 
    }

#cancel{
  background-color: #ddd !important;
  color: #3a3a3a;
}

#cancel:hover {
  background-color: #c1c1c1 !important;
  color: #3a3a3a;
}

.key-generation {
  padding: 1em;
}

.delete-btn {
  background-color: #ff4140;
  color: white;
}

.delete-btn:hover {
  background-color: #ce0500;
  color: white;
}

.fr-input-group {
  margin-bottom: 1em;
}

.fr-input-group .fr-label {
  margin-bottom: 0.5em;
}

.fr-input {
  width: 100%;
  padding: 0.8rem;
}

.cle-generer {
  display: block;
  margin-left: auto;
}

.fr-alert {
  margin: 15px;
}

/* Modal */

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
  z-index: 100;
}

.modal-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; 
}

.modal-actions .btn-cancel {
  background-color: #ddd;
  color: #3a3a3a;
  align-self: flex-end; 
}

.modal-actions .btn-cancel:hover {
  background-color: #c1c1c1;
}


.modal-actions button {
  width: 48%;
}

.modal-actions .btn-delete {
  background-color: #e1000f;
  color: white;
}

.modal-actions .btn-delete:hover {
  background-color: #c9191e;
}

.modal-actions .btn-cancel {
  background-color: #ddd;
  color: #3a3a3a;
}

.modal-actions .btn-cancel:hover {
  background-color: #c1c1c1;
}


/* Pagination */
.pagination {
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


.fr-tile__title {
  font-size: 1rem;  
  margin-bottom: 0.25rem;  
  line-height: 1.2;  
}

.search-container {
  display: flex;
  align-items: center; 
  gap: 8px; 
}


/* Tags */
.tag-container {
  margin-right: 25px;
}

.fr-tags-group .fr-tag{
  vertical-align: middle;
  margin-bottom: 0px;
}

.tooltip-container {
  position: relative;
}

.tooltip-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 5px;
}

.custom-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgb(21, 21, 21);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  white-space: nowrap;
  font-size: 14px;
  visibility: visible;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.tooltip-container:hover .custom-tooltip {
  visibility: visible;
  opacity: 1;
}

</style>
