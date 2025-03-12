<template>
  <div class="home">
    <h1 class="fr-h1">Bienvenue sur le panneau d'administration</h1>
    <div class="fr-btn-group">
      <button @click="navigateToGeoCaptcha" class="fr-btn fr-btn--primary">Créer un GéoCaptcha</button>
      <button @click="navigateToDashboard" class="fr-btn fr-btn--primary">Tableau de Bord</button>
      <button @click="navigateToKeyGeneration" class="fr-btn fr-btn--primary">Créer une clé d'accès</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    navigateToGeoCaptcha() {
      this.$router.push({ name: 'geo-captcha' });
    },
    navigateToDashboard() {
      this.$router.push({ name: 'dashboard' });
    },
    navigateToKeyGeneration() {
      this.$router.push({ name: 'key-access' });
    }
  }
}
</script>

<style scoped>
.fr-btn-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
}

.fr-btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.5;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 0.25rem;
    background-color: transparent;
    border-color: #90c149;
    color: #90c149;
    outline-color: #90c149;
}

button {
  width: 100%;
}
</style>
