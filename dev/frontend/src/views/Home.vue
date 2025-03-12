<template>
    <div class="home">
      <h1 class="fr-h1">Bienvenue sur Captchadmin Géo</h1>
      <h3 class="fr-h3">Êtes-vous:</h3>
      <div class="fr-btn-group">
      <button @click="navigateToConnexionAdmin" class="fr-btn fr-btn--secondary">Administrateur</button>
      <button @click="navigateToServiceUtilisateur" class="fr-btn fr-btn--secondary">Utilisateur</button>
    </div>
    </div>
</template>

<script>
export default {
  name: 'Home_admin',
  methods: {
    navigateToConnexionAdmin() {
      this.$router.push({ name: 'connexion-admin' });
    },
    navigateToServiceUtilisateur() {
      this.$router.push({ name: 'service-utilisateur' });
    }
  }
}
</script>


<style scoped>
.home {
  margin-top: 30px;
  text-align: center;
}

.fr-btn {
  margin: 15px; 
}

</style>