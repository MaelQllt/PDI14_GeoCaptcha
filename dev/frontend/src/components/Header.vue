<template>
    <header role="banner" class="fr-header">
    <div class="fr-header__body">
        <div class="fr-container">
            <div class="fr-header__body-row">
                <div class="fr-header__brand fr-enlarge-link">
                    <div class="fr-header__brand-top">
                        <div class="fr-header__operator">
                            <img class="fr-responsive-img" style="max-width:5rem;" src="../../../example/img/placeholder.16x9.png" alt="À MODIFIER" />
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
                        <p class="fr-header__service-tagline">Interface Administrateur des GéoCaptcha</p>
                    </div>
                </div>
                <div class="fr-header__tools">
                    <div class="fr-header__tools-links">
                        <ul class="fr-btns-group">
                            <li>
                                <a href="/geo-captcha" class="fr-btn fr-icon-earth-fill fr-btn">Création de GéoCaptcha</a>
                            </li>
                            <li>
                                <a href="/dashboard" class="fr-btn fr-icon-dashboard-3-line fr-btn">Dashboard</a>
                            </li>
                            <li>
                                <a href="/key-access" class="fr-btn fr-icon-user-setting-fill fr-btn--tertiary">Clé d'accès</a>
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
  .fr-header {
    background-color: white;
  }
  </style>
  