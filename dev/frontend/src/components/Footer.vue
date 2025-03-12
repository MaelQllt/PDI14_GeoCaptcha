<template>
    <footer class="fr-footer">
      <div class="fr-footer__content">
        <!-- Liens de navigation -->
        <nav class="fr-footer__nav">
          <ul class="fr-footer__links">
            <li><a href="/mentions-legales" class="fr-footer__link">Mentions légales</a></li>
            <li><a href="/politique-confidentialite" class="fr-footer__link">Politique de confidentialité</a></li>
            <li><a href="/" class="fr-footer__link">Retour à l'accueil</a></li>
          </ul>
        </nav>
  
        <!-- Crédits -->
        <div class="fr-footer__credits">
          <p>Développé par <strong>DCIM</strong> | <span>2025</span></p>
        </div>
        
        <!-- Icônes sociales (optionnel) -->
        <div class="fr-footer__socials">
          <a href="#" class="fr-footer__social-link">🔗</a>
          <a href="#" class="fr-footer__social-link">🐦</a>
          <a href="#" class="fr-footer__social-link">📷</a>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: "Footer",
  }
  </script>
  
  <style scoped>
  .fr-footer {
    background-color: #f5f5f5;
    padding: 20px;
    text-align: center;
    margin-top: 40px;
  }
  
  .fr-footer__content {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .fr-footer__nav {
    margin-bottom: 15px;
  }
  
  .fr-footer__links {
    margin-top: 20px;
    margin-right: 15px;
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .fr-footer__link {
    text-decoration: none;
    color: #005ea5;
  }
  
  .fr-footer__link:hover {
    text-decoration: underline;
  }
  
  .fr-footer__credits {
    margin-top: 20px;
    font-size: 14px;
  }
  
  .fr-footer__socials {
    margin-top: 20px;
  }
  
  .fr-footer__social-link {
    margin: 0 10px;
    text-decoration: none;
    font-size: 18px;
    color: #005ea5;
  }
  
  .fr-footer__social-link:hover {
    color: #007bff;
  }
  </style>
  