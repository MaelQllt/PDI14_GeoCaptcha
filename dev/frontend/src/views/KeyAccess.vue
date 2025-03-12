<template>
    <div class="key-generation">
      <h1 class="fr-h1">Création de clé d'accès API</h1>
      <form @submit.prevent="generateApiKey">
        <div class="fr-input-group">
          <label class="fr-label" for="key-name">Nom de la clé :</label>
          <input
            type="text"
            id="key-name"
            v-model="keyName"
            class="fr-input"
            placeholder="Nom de la clé d'accès"
          />
        </div>
  
        <button type="submit" class="fr-btn fr-btn--primary">Générer la clé</button>
      </form>
  
      <div v-if="generatedKey" class="fr-alert fr-alert--success">
        <p class="fr-alert__content">Clé générée : {{ generatedKey }}</p>
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
        // Logique pour générer la clé d'API (ici juste un exemple simple)
        this.generatedKey = 'API-KEY-' + Math.random().toString(36).substr(2, 9);
      }
    }
  }
  </script>
  
  <style scoped>
  .fr-btn {
    margin-top: 20px;
  }
  
  .fr-alert {
    margin-top: 20px;
  }
  </style>
  