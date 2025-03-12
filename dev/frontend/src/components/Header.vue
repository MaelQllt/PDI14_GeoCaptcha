<template>
    <header class="fr-header">
      <div class="fr-header__brand">
        <a href="/" class="fr-logo">Mon Application</a>
      </div>
      <nav class="fr-nav">
        <ul class="fr-nav__links">
          <li><a href="/" class="fr-btn fr-btn--secondary">Accueil</a></li>
          <li><a href="/geo-captcha" class="fr-btn fr-btn--secondary">Créer un GéoCaptcha</a></li>
          <li><a href="/dashboard" class="fr-btn fr-btn--secondary">Tableau de bord</a></li>
          <li><a href="/key-access" class="fr-btn fr-btn--secondary">Clé API</a></li>
        </ul>
      </nav>
    </header>
  </template>
  
  <script>
  export default {
    name: 'Header',
  }
  </script>
  
  <style scoped>
  .fr-header {
    background-color: #ebebeb;
    color: white;
    padding: 10px 0;
  }
  
  .fr-logo {
    margin-top: 30px;
    font-size: 24px;
    color: white;
    text-decoration: none;
    padding-left: 20px;
  }
  
  .fr-nav {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }
  
  .fr-nav__links {
    margin-left: 500px;
    list-style-type: none;
    padding-right: 20px;
    display: flex;
    gap: 20px;
  }
  
  .fr-nav__link {
    color: white;
    text-decoration: none;
    font-weight: bold;
  }
  
  .fr-nav__link:hover {
    text-decoration: underline;
  }
  </style>
  