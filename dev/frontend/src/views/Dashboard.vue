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
          <h1 class="fr-h1">Liste des Géocaptchas</h1>
          <div v-for="item in items" :key="item.id" class="item" @click="selectGeocaptcha(item)">
            <img :src="logoSrc" alt="Logo Géocaptcha" class="geocaptcha-logo" />
            <div class="item-info">
              <p><strong>Attempts:</strong> {{ item.attempts }}</p>
              <p><strong>Successes:</strong> {{ item.successes }}</p>
              <p><strong>Failures:</strong> {{ item.failures }}</p>
              <p><strong>Accuracy:</strong> {{ item.accuracy }}%</p>
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
                      <p><strong>Essais:</strong> {{ selectedGeocaptcha.attempts }}</p>
                      <p><strong>Réussites:</strong> {{ selectedGeocaptcha.successes }}</p>
                      <p><strong>Echecs:</strong> {{ selectedGeocaptcha.failures }}</p>
                      <p><strong>Précision:</strong> {{ selectedGeocaptcha.accuracy }}%</p>
                    </div>

                    <!-- Colonne de l'image -->
                    <div>
                      <img :src="logoSrc" alt="Logo Géocaptcha" class="geocaptcha-logo" />
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
      selectedGeocaptcha: null,  // Ajouter l'état pour stocker le géocaptcha sélectionné
      isModalVisible: false,      // Ajouter l'état pour contrôler la visibilité du modal
      isConfirmationModalVisible: false,  // État pour la fenêtre modale de confirmation
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch("http://localhost:3002/geocaptchas");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        const data = await response.json();
        this.items = data;

        this.totalResolved = this.items.reduce((total, item) => total + item.successes, 0);

        const totalAttempts = this.items.reduce((total, item) => total + item.attempts, 0);
        const totalSuccesses = this.items.reduce((total, item) => total + item.successes, 0);
        this.successRate = totalAttempts > 0 ? parseFloat(((totalSuccesses / totalAttempts) * 100).toFixed(2)) : 0;

      } catch (error) {
        this.error = true;
        console.error("Erreur:", error);
      }
    },

    selectGeocaptcha(item) {
      this.selectedGeocaptcha = item;  // Stocker les informations du géocaptcha sélectionné
      this.isModalVisible = true;      // Afficher le modal
    },

    closeModal() {
      this.isModalVisible = false;  // Fermer le modal
      this.selectedGeocaptcha = null; // Réinitialiser les informations du géocaptcha
    },

    showConfirmationModal() {
      this.isConfirmationModalVisible = true; // Afficher la fenêtre modale de confirmation
    },

    closeConfirmationModal() {
      this.isConfirmationModalVisible = false; // Fermer la fenêtre modale de confirmation
    },

    async rejectGeocaptcha() {
  this.isRejecting = true;
  try {
    // Suppression du géocaptcha
    const response = await fetch(`http://localhost:3002/geocaptchas/${this.selectedGeocaptcha.id}`, {
      method: 'DELETE',
    });

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
  } finally {
    this.isRejecting = false;
  }
}


  },
  mounted() {
    window.scrollTo(0, 0);
    this.fetchData();  // Appeler la méthode fetchData au montage du composant
  }
};
</script>



<style scoped>
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

.geocaptcha-logo {
  width: 80px; /* Ajuste la taille en fonction de tes besoins */
  height: auto;
  margin-bottom: 15px;
  object-fit: contain; /* Assure que l'image garde ses proportions */
}

/* Style pour le modal */
.modal-overlay .fr-modal__content {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2 colonnes de taille égale */
  gap: 15px; /* Espacement entre les colonnes */
  align-items: center; /* Centrer les éléments verticalement */
}

/* Style pour l'image du logo dans le modal */
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

.modal {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative; /* Permet de positionner les éléments enfants de manière absolue */
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


.item-info {
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 0.5rem 1.5rem;
  font-size: 0.9rem;
}

.item-info p {
  margin: 0;
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

.modal {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}


/* Style pour l'en-tête du modal */
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

</style>

