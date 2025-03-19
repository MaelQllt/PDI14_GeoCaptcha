<template>
    <header role="banner" class="fr-header">
    <div class="fr-header__body">
        <div class="fr-container">
            <div class="fr-header__body-row">
                <div class="fr-header__brand fr-enlarge-link">
                    <div class="fr-header__brand-top">
                        <div class="fr-header__operator">
                            <img class="fr-responsive-img" style="max-width:4rem;" src="../assets/Logo_1-transparent.png" alt="À MODIFIER" />
                            <!-- L’alternative de l’image (attribut alt) doit impérativement être renseignée et reprendre le texte visible dans l’image -->
                        </div> 
                        <div class="fr-header__navbar">
                            <button data-fr-opened="false" aria-controls="modal-2186" title="Menu" type="button" id="button-2187" class="fr-btn--menu fr-btn">Menu</button>
                        </div>
                    </div>
                    <div class="fr-header__service">
                        <a href="/" title="Accueil - Captchadmin">
                            <p class="fr-header__service-title">
                                Captchadmin Géo
                                <span class="fr-badge fr-badge--sm fr-badge--green-emeraude">BETA</span>
                            </p>
                        </a>
                        <p class="fr-header__service-tagline">Interface Administrateur du GéoCaptcha</p>
                    </div>
                </div>
                <div class="fr-header__tools">
                    <div class="fr-header__tools-links">
                        <ul class="fr-btns-group">
                            <li>
                                <a href="/service-utilisateur" class="fr-btn">Obtenir une clé d'accès</a>
                            </li>
                            <li>
                                <a href="/connexion-admin" class="fr-btn fr-icon-account-circle-fill fr-btn--tertiary">Se connecter en tant qu'administrateur</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>
  </template>
  
  <script>
  export default {
    name: 'Header',
  }
  </script>
  
  <style scoped>
  
  .fr-responsive-img {
    margin-right: -22px;
  }

  </style>