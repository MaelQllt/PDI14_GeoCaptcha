<template>
    <div class="cle">
        <h2 class="fr-h2">Demande de clé d'accès</h2>

        <form @submit.prevent="generateApiKey">
        <div class="fr-input-group">
          <label class="fr-label" for="key-name">Entrez votre adresse mail</label>
          <input
            type="text"
            id="key-name"
            v-model="keyName"
            class="fr-input"
            placeholder="exemple@xyz.fr"
          />
        </div>
  
        <button type="submit" class="fr-btn fr-btn--primary">Générer une clé</button>
      </form>
      <div id="alert-1068" v-if="generatedKey" class="fr-alert fr-alert--success">
        <p class="fr-alert__content">{{ generatedKey }}</p>
      </div>
    </div>
</template>



<script>
  export default {
    data() {
      return {
        keyName: '',
        generatedKey: ''
      };
    },
    methods: {
      generateApiKey() {
        this.generatedKey = 'La demande à bien été prise en compte, vous recevrez un mail de confirmation, contenant la clé d\'accès.';
      }
    }
  }
  </script>

<style scoped>

.cle {
    max-width: 50%;
    margin: 0 auto;
}

.fr-h2 {
    margin-top: 30px;
    text-align: center;
}

.fr-btn {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.fr-alert {
  margin-top: 20px;
}
</style>