<template>
  <footer class="fr-footer" role="contentinfo" id="footer-6953">
    <!-- Container principal du footer -->
    <div class="fr-container">
      <!-- Corps du footer -->
      <div class="fr-footer__body">
        <!-- Affichage logo et république française -->
        <div class="fr-footer__brand fr-enlarge-link">
          <a id="footer-brand-link-6954" title="Captchadmin Géo" href="/">
            <p class="fr-logo">
              République<br>française
            </p>
          </a>
        </div>

        <!-- Contenu principal du footer -->
        <div class="fr-footer__content">
          <!-- Description du contenu -->
          <p class="fr-footer__content-desc">
            Interface administrateur des GéoCaptchas réalisé par des étudiants de l'ENSG. Les GéoCaptchas sont des défis Captcha innovants développés par la MARS (Mission Architecture Réseau et Sécurité) et qui sont basés sur des données géographiques.
          </p>

          <!-- Liste des liens utiles -->
          <ul class="fr-footer__content-list">
            <li class="fr-footer__content-item">
              <a title="géocaptcha.fr - nouvelle fenêtre" id="footer__content-link-6957" href="https://qlf-geocaptcha.ign.fr/api/v1/#" target="_blank" rel="noopener external" class="fr-footer__content-link">
                géocaptcha.ign.fr
              </a>
            </li>
            <li class="fr-footer__content-item">
              <a title="ign.fr - nouvelle fenêtre" id="footer__content-link-6955" href="https://www.ign.fr/" target="_blank" rel="noopener external" class="fr-footer__content-link">
                ign.fr
              </a>
            </li>
            <li class="fr-footer__content-item">
              <a title="ensg.eu - nouvelle fenêtre" id="footer__content-link-6956" href="https://ensg.eu/fr" target="_blank" rel="noopener external" class="fr-footer__content-link">
                ensg.eu
              </a>
            </li>
            <li class="fr-footer__content-item">
              <a title="github du projet - nouvelle fenêtre" id="footer__content-link-6958" href="https://github.com/MaelQllt/PDI14_GeoCaptcha" target="_blank" rel="noopener external" class="fr-footer__content-link">
                github du projet
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Partie inférieure du footer -->
      <div class="fr-footer__bottom">
        <!-- Liste des liens de la partie inférieure -->
        <!-- La plupart des liens ne renvoient vers rien pour le moment -->
        <ul class="fr-footer__bottom-list">
          <li class="fr-footer__bottom-item">
            <a id="footer__bottom-link-6959" href="/" class="fr-footer__bottom-link">
              Retour à l'accueil
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a id="footer__bottom-link-6961" href="[url - à modifier]" class="fr-footer__bottom-link">
              Mentions légales
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a id="footer__bottom-link-6962" href="[url - à modifier]" class="fr-footer__bottom-link">
              Données personnelles
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a id="footer__bottom-link-6963" href="[url - à modifier]" class="fr-footer__bottom-link">
              Gestion des cookies
            </a>
          </li>
        </ul>

        <!-- Texte de copyright -->
        <div class="fr-footer__bottom-copy">
          <p>© IGN 2025 - Tous droits réservés - Captchamin Géo, l'interface administrateur du GéoCaptcha de l'IGN</p>
        </div>
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
  padding: 20px;
  text-align: center;
  margin-top: auto;
}

.fr-logo {
  text-align: justify;
}

.fr-footer__content {
  margin-right: 0px;
}

.fr-footer__content-desc {
  text-align: justify;
}

.footer-logo {
  width: 120px; /* Taille des logos */
  height: 120px;
  object-fit: contain; 
}

.footer-logo.middle {
  margin-left: auto; 
  margin-right: auto; 
}

.fr-footer__bottom-copy {
  width: 60%; 
  margin: 0 auto;
}
</style>
