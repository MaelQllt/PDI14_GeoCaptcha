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
            <div class="fr-search-bar">
              <input
                class="fr-input"
                placeholder="Rechercher par nom"
                type="search"
                v-model="searchQuery"
              />
              <button title="Rechercher" type="button" class="fr-btn"> Rechercher </button>
            </div>
          </div>

          <div class="fr-grid-row fr-grid-row--gutters">
            <div
              v-for="(key, index) in filteredKeys"
              :key="index"
              class="fr-col-12 fr-col-md-6 fr-col-lg-4"
            >
              <div class="fr-tile">
                <div class="fr-tile__body">
                  <button type="button" class="delete-btn fr-btn fr-btn--sm" @click="openModal(key.appId)">
                    Supprimer
                  </button>
                </div>
                <div class="fr-tile__header">
                  <h3 class="fr-tile__title">Nom : {{ key.appId }}</h3>
                  <h3 class="fr-tile__title">Adresse mail : {{ key.email }}</h3>
                  <h3 class="fr-tile__title">Referer : {{ key.referer }}</h3>
                  <h3 class="fr-tile__title">Rôle : {{ key.role }}</h3>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination Controls -->
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
          <div v-if="filteredKeys.length === 0" class="fr-alert fr-alert--info">
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

      <div
        id="tabpanel-405-panel"
        class="fr-tabs__panel"
        :class="{ 'fr-tabs__panel--selected': activeTab === 'tabpanel-405' }"
        role="tabpanel"
        aria-labelledby="tabpanel-405"
      >
        <!-- Contenu principal de la page -->
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
                placeholder="Exemple : http(s)://application-client1.eu/"
                @input="validateReferer"
                required
              />
              <span v-if="referer && !isValidReferer" class="fr-error">Le format de l'URL est incorrect. Exemple : http(s)://application-client1.eu/</span>
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
    };
  },
  computed: {
    filteredKeys() {
    const filtered = this.apiKeys.filter(key => {
      const searchQueryLower = this.searchQuery.toLowerCase();
      
      const appIdMatch = key.appId && key.appId.toLowerCase().includes(searchQueryLower);
      const emailMatch = key.email && key.email.toLowerCase().includes(searchQueryLower);
      const refererMatch = key.referer && key.referer.toLowerCase().includes(searchQueryLower);

      return appIdMatch || emailMatch || refererMatch;
    });

    // Pagination
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return filtered.slice(start, end);
  },
  totalPages() {
    return Math.ceil(this.apiKeys.length / this.itemsPerPage);
  }
  },
  methods: {

    switchTab(tabId) {
      this.activeTab = tabId;
      this.fetchKeys();
    },

    validateReferer() {
    const regex = /^(https?:\/\/)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+\/$/;
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
      if (!this.keyName || !this.email) {
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

    // Méthode pour récupérer les clés depuis le serveur

   

    // Méthode pour générer une nouvelle clé d'accès
    async generateApiKey() {
      const newKey = {
        appId : this.keyName, //Au lieu de name, il fallait mettre appId pour que ça reste le nom des champs attendus par l'api.
        email: this.email,
        referer: this.referer, // J'ai ajouté ça
        role: this.role,      // J'ai ajouté ça
        // value: "API-KEY-" + Math.random().toString(36).substr(2, 9) : il fait par l'api directement c'est pas à nous de faire(Je pense)
      };

      try {
        const response = await fetch("https://qlf-geocaptcha.ign.fr/api/v1/admin/cuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey,
            "x-app-id": this.apiId
          },
          body: JSON.stringify(newKey)
        });

        // Vérifiez si la requête a réussi (status 200-299)
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }



        await this.fetchKeys();
        this.keyName = "";
        this.email = "";
        this.referer = ""; // J'ai ajouté ça
        this.role = "";     // J'ai ajouté ça
        this.showConfirmationModal = false; // Ferme le modal de confirmation après la génération

      } catch (error) {
        console.error("Erreur lors de la génération de la clé", error);
        this.errorMessage = "Une erreur est survenue lors de la génération de la clé.";
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

.fr-tabs{
  margin-left: 50px;
  margin-right: 50px;
  margin-top: 170px;  
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
  height: auto !important;
  display: none;
}

/* Afficher le panel sélectionné */
.fr-tabs__panel--selected {
  visibility: visible;
  display: block; 
  opacity: 1; /* Rendre le panel visible */
}

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

.key-generation {
  padding: 1em;
}

.fr-grid-row .delete-btn {
  background-color: #ff4140;
}

.fr-grid-row .delete-btn:hover {
  background-color: #ce0500;
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
  align-items: flex-end; /* Ajoute un alignement en bas */
}

.modal-actions .btn-cancel {
  background-color: #ddd;
  color: #3a3a3a;
  align-self: flex-end; /* Aligne le bouton "Fermer" en bas à droite */
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

#OK{
  background-color: #7fc04b !important;
}

#OK:hover {
  background-color: #68a532 !important;
}

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
        background-color: #ff4140; /* Couleur personnalisée */
        color: #fff; /* Couleur du texte */
    }

    .fr-btn--reject:hover {
        background-color: #ce0500; /* Couleur au survol */
    }

#cancel{
  background-color: #ddd !important;
  color: #3a3a3a;
}

#cancel:hover {
  background-color: #c1c1c1 !important;
  color: #3a3a3a;
}

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
</style>
