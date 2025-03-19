<template>
  <div class="page-container">
    <!-- Contenu principal de la page -->
    <main class="main-content">
      <div class="key-generation">
        <h1 class="fr-h1">Création de clé d'accès API</h1>
        <form @submit.prevent="openConfirmationModal">
          <div class="fr-input-group">
            <label class="fr-label" for="key-name">Nom :</label>
            <input type="text" id="key-name" v-model="keyName" class="fr-input" placeholder="Nom associé à la clé d'accès" />
          </div>

          <div class="fr-input-group">
            <label class="fr-label" for="email">Adresse mail associée :</label>
            <input type="email" id="email" v-model="email" class="fr-input" placeholder="Adresse mail" />
          </div>

          <button type="submit" class="fr-btn fr-btn--primary">Générer la clé</button>
        </form>
      </div>

      <div class="key-list">
        <div class="barre">
          <h1>Liste des clés d'accès</h1>
          <div class="fr-search-bar">
            <input
              class="fr-input"
              placeholder="Rechercher par nom"
              type="search"
              v-model="searchQuery"
            />
            <button title="Rechercher" type="button" class="fr-btn"> Rechercher</button>
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
                <button type="button" class="fr-btn fr-btn--sm" @click="openModal(key.id)">
                  Supprimer
                </button>
              </div>
              <div class="fr-tile__header">
                <h3 class="fr-tile__title">Nom : {{ key.name }}</h3>
                <h3 class="fr-tile__title">Adresse mail : {{ key.email }}</h3>
                <h3 class="fr-tile__title">Clé d'accès : {{ key.value }}</h3>
              </div>
            </div>
          </div>
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
                <button @click="confirmDelete" class="fr-btn fr-btn--reject">Oui, supprimer</button>
                <button @click="closeModal" class="fr-btn fr-btn--cancel" id="cancel">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de génération -->
    <div v-if="showConfirmationModal" class="modal-overlay">
      <div class="fr-container fr-container--fluid fr-container-md">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <div class="fr-modal__body">
              <div class="fr-modal__header">
                <h2 class="fr-modal__title">
                  <span class="fr-icon-check-line fr-icon--lg" aria-hidden="true"></span>
                  Génération de clé
                </h2>
                <button @click="generateApiKey" class="fr-btn--close fr-btn" id="close">Fermer</button>
              </div>
              <div class="fr-modal__content">
                <p>La clé a été générée avec succès.</p>
              </div>
              <div class="fr-modal__footer fr-btns-group--right">
                <button @click="generateApiKey" class="fr-btn fr-btn--primary" id="OK">OK</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'erreur pour les champs requis -->
    <div v-if="showMissingInfoModal" class="modal-overlay">
      <div class="fr-container fr-container--fluid fr-container-md">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <div class="fr-modal__body">
              <div class="fr-modal__header">
                <h2 class="fr-modal__title">
                  <span class="fr-icon-error-line fr-icon--lg" aria-hidden="true"></span>
                  Informations manquantes
                </h2>
                <button @click="closeMissingInfoModal" class="fr-btn--close fr-btn" id="close">Fermer</button>
              </div>
              <div class="fr-modal__content">
                <p>Veuillez remplir tous les champs requis avant de générer une clé.</p>
              </div>
              <div class="fr-modal__footer fr-btns-group--right">
                <button @click="closeMissingInfoModal" class="fr-btn fr-btn--primary" id="OK">OK</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyName: "",
      email: "",
      apiKeys: [],
      searchQuery: "",
      showModal: false, // Contrôle l'affichage du modal de suppression
      keyToDelete: null, // Stocke l'ID de la clé à supprimer
      showConfirmationModal: false, // Contrôle l'affichage du modal de confirmation pour la génération de clé
      showMissingInfoModal: false, // Contrôle l'affichage du modal si l'utilisateur n'a pas rempli les infos
    };
  },
  computed: {
    filteredKeys() {
      return this.apiKeys.filter((key) =>
        key.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        key.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
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
    async fetchKeys() {
      const response = await fetch("http://localhost:3002/keys");
      this.apiKeys = await response.json();
    },

    // Méthode pour générer une nouvelle clé d'accès
    async generateApiKey() {
      const newKey = {
        name: this.keyName,
        email: this.email,
        value: "API-KEY-" + Math.random().toString(36).substr(2, 9)
      };

      try {
        await fetch("http://localhost:3002/keys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newKey)
        });

        this.fetchKeys();
        this.keyName = "";
        this.email = "";
        this.showConfirmationModal = false; // Ferme le modal de confirmation après la génération
      } catch (error) {
        console.error("Erreur lors de la génération de la clé", error);
      }
    },

    // Méthode pour supprimer la clé d'accès après confirmation
    async deleteKey(id) {
      if (!id) return;

      try {
        const response = await fetch(`http://localhost:3002/keys/${id}`, { method: "DELETE" });

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de la clé.");
        }

        this.fetchKeys();  // Recharge la liste après suppression
        this.closeModal();  // Ferme le modal après suppression
      } catch (error) {
        console.error("Erreur:", error);
      }
    }
  },
  mounted() {
    window.scrollTo(0, 0);
    this.fetchKeys(); // Appel de la méthode pour récupérer les clés dès le chargement de la page
  }
};
</script>

<style scoped>

/* Main */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding: 2rem;
  margin-top: 80px;
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


.fr-btn {
  background-color: #7fc04b;
}

.fr-btn:hover {
  background-color: #68a532;
}

.fr-grid-row button {
  background-color: #ff4140;
}

.fr-grid-row button:hover {
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

.fr-input:focus,
.fr-select:focus {
  outline: 2px solid #7fc04b;
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
</style>
