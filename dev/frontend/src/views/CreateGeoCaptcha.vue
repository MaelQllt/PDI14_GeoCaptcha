<template>
  <div class="geo-captcha">
    <h1 class="fr-h1">Créez vos GéoCaptchas</h1>
    <form @submit.prevent="createGeoCaptcha">
      <div class="fr-input-group">
        <label class="fr-label" for="difficulty">Difficulté :</label>
        <select id="difficulty" v-model="difficulty" class="fr-select">
          <option value="easy">Facile</option>
          <option value="medium">Moyenne</option>
          <option value="hard">Difficile</option>
        </select>

        <label class="fr-label" for="departement">Département :</label>
        <select id="departement" v-model="selectedDepartement" class="fr-select">
          <option v-for="dept in availableDepartements" :key="dept.numero" :value="dept.numero">
            {{ dept.nom }} ({{ dept.numero }})
          </option>
        </select>
      </div>
      
      <button type="submit" class="fr-btn fr-btn--primary">Créer le GéoCaptcha</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      difficulty: 'easy',
      selectedDepartement: "",
      departements: []
    };
  },

  computed: {
    availableDepartements() {
      return this.departements.filter(dept => dept.disponibilite === "Disponible");
    }
  },
  mounted() {
    fetch("http://localhost:3000/departements") // Récupération des départements depuis le backend
      .then(response => response.json())
      .then(data => {
        this.departements = data;
      })
      .catch(error => console.error("Erreur lors du chargement des départements:", error));
  },
  
  methods: {
    createGeoCaptcha() {
      // Logique pour créer un GéoCaptcha (à implémenter)
      alert(`GéoCaptcha créé avec une difficulté : ${this.difficulty}`);
    }
  }
}
</script>

<style scoped>

.geo-captcha {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 10em;
}


.geo-captcha {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.fr-btn {
  margin-top: 20px;
  align-self: center;
  background-color: #95e257;
}


.fr-btn:hover {
  background-color: #7fc04b;
}

.fr-input:focus,
.fr-select:focus {
  outline: 2px solid #95e257;
}

</style>
