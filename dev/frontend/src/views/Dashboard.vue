<template>
    <div class="dashboard">
      <h1 class="fr-h1">Tableau de Bord</h1>
      
      <div class="fr-card">
        <h2 class="fr-card__title">Métriques GéoCaptcha</h2>
        <p class="fr-card__content">Nombre total de GéoCaptchas créés : 100</p>
        <p class="fr-card__content">Nombre de GéoCaptchas réussis : 85</p>
        <p class="fr-card__content">Nombre de GéoCaptchas échoués : 15</p>
      </div>
  
      <div class="fr-card">
        <h2 class="fr-card__title">Logs</h2>
        <ul class="fr-list">
          <li class="fr-list__item">GéoCaptcha créé par l'utilisateur A</li>
          <li class="fr-list__item">GéoCaptcha échoué par l'utilisateur B</li>
          <li class="fr-list__item">GéoCaptcha créé par l'utilisateur C</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DashboardPage'
  }
  </script>
  
  <style scoped>
  .fr-card {
    margin-top: 20px;
  }
  
  .fr-list {
    margin-top: 20px;
  }
  </style>
  