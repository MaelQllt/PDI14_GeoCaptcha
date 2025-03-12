<template>
  <div class="geo-captcha">
    <h1 class="fr-h1">Créer un GéoCaptcha</h1>
    <form @submit.prevent="createGeoCaptcha">
      <div class="fr-input-group">
        <label class="fr-label" for="difficulty">Difficulté :</label>
        <select id="difficulty" v-model="difficulty" class="fr-select">
          <option value="easy">Facile</option>
          <option value="medium">Moyenne</option>
          <option value="hard">Difficile</option>
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
      difficulty: 'easy'
    };
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
form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.fr-btn {
  margin-top: 20px;
}
</style>
