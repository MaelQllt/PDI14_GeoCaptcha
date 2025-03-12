<template>
  <div class="key-generation">
    <h1 class="fr-h1">Création de clé d'accès API</h1>
    <form @submit.prevent="generateApiKey">
      <div class="fr-input-group">
        <label class="fr-label" for="key-name">Nom :</label>
        <input type="text" id="key-name" v-model="keyName" class="fr-input" placeholder="Nom de la clé d'accès" />
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
        <input class="fr-input" placeholder="Rechercher" type="search">
        <button title="Rechercher" type="button" class="fr-btn">Rechercher</button>
      </div>
    </div>

    <div class="fr-grid-row fr-grid-row--gutters">
      <div v-for="(key, index) in apiKeys" :key="index" class="fr-col-12 fr-col-md-6 fr-col-lg-4">
        <div class="fr-tile">
          <div class="fr-tile__body">
            <button type="button" class="fr-btn fr-btn--sm" @click="deleteKey(key.id)">Supprimer</button>
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
</template>

<script>
export default {
  data() {
    return {
      keyName: '',
      email: '',
      apiKeys: []
    };
  },
  methods: {
    async fetchKeys() {
      const response = await fetch("http://localhost:3000/keys");
      this.apiKeys = await response.json();
    },
    async generateApiKey() {
      if (!this.keyName || !this.email) {
        alert("Veuillez remplir tous les champs.");
        return;
      }

      const newKey = {
        name: this.keyName,
        email: this.email,
        value: "API-KEY-" + Math.random().toString(36).substr(2, 9)
      };

      await fetch("http://localhost:3000/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newKey)
      });

      this.fetchKeys(); // Recharger la liste après ajout
      this.keyName = "";
      this.email = "";
    },
    async deleteKey(id) {
      await fetch(`http://localhost:3000/keys/${id}`, { method: "DELETE" });
      this.fetchKeys(); // Recharger la liste après suppression
    }
  },
  mounted() {
    this.fetchKeys();
  }
};
</script>
  
  <style scoped>
  
  
  .fr-alert {
    margin-top: 20px;
  }

  .key-list {
    margin: 1em;
  }

  .barre {
    display:flex;
    justify-content: space-between;
    align-items: center;
  }

.barre h1 {
  margin: 0;
  display: flex;
  align-items: center;
}

.key-generation {
  padding: 1em;
}
</style>
  