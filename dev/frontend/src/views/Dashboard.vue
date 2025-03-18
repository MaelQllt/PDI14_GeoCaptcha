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
        <div v-for="item in items" :key="item.id" class="item">
            <h3>Status: {{ item.status }}</h3>
            <p>Attempts: {{ item.attempts }}</p>
            <p>Successes: {{ item.successes }}</p>
            <p>Failures: {{ item.failures }}</p>
            <p>Accuracy: {{ item.accuracy }}%</p>
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
      items: [],         // Liste des items à afficher
      loading: true,     // Indicateur de chargement
      error: false,      // Indicateur d'erreur de chargement
      totalResolved: 0,  // Total des géocaptchas résolus
      successRate: 0     // Taux de réussite
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
    console.log(data);  // Ajouter ce log pour vérifier la réponse
    this.items = data;
    // Calculs des métriques...
  } catch (error) {
    this.error = true;
    console.error("Erreur:", error);
  }
}

  },
  mounted() {
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
  grid-template-columns: repeat(3, 1fr); /* Crée une grille de 3 colonnes */
  gap: 1.5rem; /* Espace entre les éléments */
  margin-top: 2rem; /* Ajoute un espacement supplémentaire entre le titre et la grille */
  clear: both; /* Force le début sous l'élément précédent */
}



.item {
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.item h3 {
  margin: 0 0 0.5rem;
}

.item p {
  margin: 0.3rem 0;
}
</style>
