<template>
  <div class="page-container">
    <!-- Contenu principal de la page -->
    <main class="main-content">
      <div class="metrics-dashboard">
        <h1 class="fr-h1">Dashboard des Métriques des Géocaptchas</h1>

        <!-- Graphiques et métriques -->
        <div class="metrics-overview">
          <h2 class="fr-h2">Vue d'ensemble des métriques</h2>
          
          <div class="metric-card">
            <h3>Total des Géocaptchas Résolus</h3>
            <p>{{ totalResolved }} géocaptchas</p>
          </div>

          <div class="metric-card">
            <h3>Taux de Réussite</h3>
            <p>{{ successRate }}%</p>
          </div>
        </div>

        <!-- Liste des géocaptchas analysés -->
        <div class="metrics-list">
          <div class="list-header">
            <h1 class="fr-h1">Liste des Géocaptchas</h1>
            <div class="fr-select-group" style="text-align: right;">
              <label class="fr-label" for="filter-select">
                <span class="fr-icon-filter-line fr-icon--sm" aria-hidden="true"></span>
                Filtrer
              </label>
              <select class="fr-select" aria-describedby="select-messages" id="filter-select" v-model="filterOption" @change="applyFilter">
                <option value="all">Tous</option>
                <option value="id-asc">ID (croissant)</option>
                <option value="id-desc">ID (décroissant)</option>
                <option value="success-asc">Précision (croissant)</option>
                <option value="success-desc">Précision (décroissant)</option>
              </select>
            </div>
          </div>
          <div v-for="item in filteredItems" :key="item.id" class="item" @click="selectGeocaptcha(item)">
            <img :src="logoSrc" alt="Logo Géocaptcha" class="geocaptcha-logo" />
            <div class="item-info">
              <p><strong>ID:</strong> {{ item.id }}</p>
              <p><strong>Essais:</strong> {{ item.attempts }}</p>
              <p><strong>Succès:</strong> {{ item.successes }}</p>
              <p><strong>Echecs:</strong> {{ item.failures }}</p>
              <p><strong>Précision:</strong> {{ item.accuracy }}%</p>
            </div>
          </div>
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
    </main>
  </div>
</template>

<script>
import logo from "@/assets/logo.png"; // Importation de l'image

export default {
  data() {
    return {
      items: [],
      loading: true,
      error: false,
      totalResolved: 0,
      successRate: 0,
      logoSrc: logo,
      selectedGeocaptcha: null,
      isModalVisible: false,
      isConfirmationModalVisible: false,
      filterOption: 'all', // Option de filtrage par défaut
      apiKey: import.meta.env.VITE_API_KEY,
      apiId: import.meta.env.VITE_API_ID,
      firstObject: 1,
      nbObjects: 20,
    };
  },
  computed: {
    // Propriété calculée pour filtrer les items
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
    }
  },
  methods: {
    // Appliquer le filtre
    applyFilter() {
      console.log("Filtre appliqué:", this.filterOption);
    },

    // Récupérer les données des géocaptchas
    async fetchData() {
      try {
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

        this.items = data.sessions.map(session => ({
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

        // Calculer les métriques
        this.totalResolved = this.items.reduce((total, item) => total + item.successes, 0);
        const totalAttempts = this.items.reduce((total, item) => total + item.attempts, 0);
        const totalSuccesses = this.items.reduce((total, item) => total + item.successes, 0);
        this.successRate = totalAttempts > 0 ? parseFloat(((totalSuccesses / totalAttempts) * 100).toFixed(2)) : 0;

      } catch (error) {
        this.error = true;
        console.error("Erreur:", error);
      }
    },

    // Sélectionner un géocaptcha
    async selectGeocaptcha(item) {
      try {
        // Stocker les informations du géocaptcha sélectionné
        this.selectedGeocaptcha = item;
        this.isModalVisible = true; // Afficher le modal
      } catch (error) {
        console.error("Erreur lors de la sélection du géocaptcha:", error);
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

        // Fermeture des modaux
        this.closeModal();
        this.closeConfirmationModal();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  },
  mounted() {
    window.scrollTo(0, 0);
    this.fetchData(); // Appeler la méthode fetchData au montage du composant
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


/* Metriques */
.metrics-dashboard {
  padding: 1em;
}

.metrics-overview {
  margin-bottom: 2em;
}

.metric-card {
  background-color: #f9f9f9;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
}

.metric-card h3 {
  margin: 0;
}

.metric-card p {
  font-size: 1.2rem;
}

.metrics-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;

}

.metrics-list h1 {
  grid-column: span 3;
  text-align: left;
}

.item {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.item-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 colonnes */
  gap: 0.5rem 1.5rem;
  font-size: 0.9rem;
}

.item-info p {
  margin: 0;
}

/* Cibler le dernier élément quand il y a un nombre impair d'éléments */
.item-info p:nth-last-child(1) {
  grid-column: span 2; /* Prendre les 2 colonnes */
  text-align: center; /* Centrer le texte */
}


.geocaptcha-logo {
  width: 80px; /* Ajuste la taille en fonction de tes besoins */
  height: auto;
  margin-bottom: 15px;
  object-fit: contain; /* Assure que l'image garde ses proportions */
}

/* Style pour le modal */

.modal {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.modal-overlay .fr-modal__content {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2 colonnes de taille égale */
  gap: 15px; /* Espacement entre les colonnes */
  align-items: center; /* Centrer les éléments verticalement */
}

.modal-overlay .geocaptcha-logo {
  width: 120px; /* Ajuste la taille de l'image */
  height: auto;
  object-fit: contain; /* Assure que l'image garde ses proportions */
  justify-self: center; /* Centrer l'image horizontalement */
}

/* Style pour le modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}


.modal button {
  position: absolute;  /* Positionner le bouton de manière absolue par rapport au modal */
  bottom: 10px;        /* Espacement de 10px depuis le bas du modal */
  left: 50%;           /* Centrer horizontalement */
  transform: translateX(-50%); /* Ajuster pour un centrage parfait */
  padding: 0.5rem 1rem;
  background-color: #e55a5a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal button:hover {
  background-color: #d13c3c;
}


.fr-modal__header {
  display: flex;
  justify-content: space-between; /* Espacer le titre et le bouton */
  align-items: center; /* Centrer verticalement */
  margin-bottom: 1rem; /* Ajoute un petit espace sous l'en-tête */
}

.fr-modal__title {
  margin: 0;
  font-size: 1.5rem; /* Ajuste la taille du titre si nécessaire */
}

.fr-btn--close {
  background: none;
  border: none;
  color: #000;
  cursor: pointer;
}

.fr-btn--close:hover {
  color: #3a3a3a !important;
}

.fr-btn--reject {
        background-color: #ff4140; /* Couleur personnalisée */
        color: #fff; /* Couleur du texte */
    }

    .fr-btn--reject:hover {
        background-color: #ce0500; /* Couleur au survol */
    }

.fr-btn--cancel {
    background-color: #ddd; /* Couleur personnalisée */
    color: #3a3a3a; /* Couleur du texte */
}

.fr-btn--cancel:hover {
    background-color: #c1c1c1; /* Couleur personnalisée */
    color: #3a3a3a; /* Couleur du texte */
}


/* filtre */
/* Ajout pour l'en-tête de liste avec filtre */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  grid-column: span 3;
}

.list-header h1 {
  margin: 0;
}

.fr-select-group {
  min-width: 200px;
}

/* Modifier le style du fr-label pour aligner le texte à droite */
.fr-label {
  display: flex;
  justify-content: flex-end; /* Aligne à droite */
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 500;
  text-align: right; /* Texte aligné à droite */
}

/* Pour aligner l'icône et le texte */
.fr-icon--sm {
  margin-right: 0.3rem; /* Espace entre l'icône et le texte */
}

.fr-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

/* S'assurer que le sélecteur DSFR s'intègre bien */
.fr-select:focus {
  outline: 1px solid #7fc04b;
  outline-offset: 1px;
}
</style>

