<template>
  <footer class="fr-footer" role="contentinfo" id="footer-6953">
  <div class="fr-container">
      <div class="fr-footer__body">
          <div class="fr-footer__brand fr-enlarge-link">
              <a id="footer-brand-link-6954" title="Captchadmin Géo" href="/">
                  <p class="fr-logo">
                      République<br>française
                  </p>
              </a>
          </div>
          
          <!--
          <div>
          <img src="@/assets/IGN.png" alt="Logo de l'IGN" class="footer-logo middle" />
          <img src="@/assets/ENSG.png" alt="Logo de l'école" class="footer-logo" />
          </div>
          -->
          
          <div class="fr-footer__content">
              <p class="fr-footer__content-desc">Interface administrateur des GéoCaptchas réalisé par des étudiants de l'ENSG. Les GéoCaptchas sont des défis Captcha innovants développés par la MARS (Mission Architecture Réseau et Sécurité) et qui sont basés sur des données géographiques.</p>
              <ul class="fr-footer__content-list">
                  <li class="fr-footer__content-item">
                      <a title="géocaptcha.fr - nouvelle fenêtre" id="footer__content-link-6957" href="https://qlf-geocaptcha.ign.fr/api/v1/#" target="_blank" rel="noopener external" class="fr-footer__content-link">géocaptcha.ign.fr</a>
                  </li>
                  <li class="fr-footer__content-item">
                      <a title="ign.fr - nouvelle fenêtre" id="footer__content-link-6955" href="https://www.ign.fr/" target="_blank" rel="noopener external" class="fr-footer__content-link">ign.fr</a>
                  </li>
                  <li class="fr-footer__content-item">
                      <a title="ensg.eu - nouvelle fenêtre" id="footer__content-link-6956" href="https://ensg.eu/fr" target="_blank" rel="noopener external" class="fr-footer__content-link">ensg.eu</a>
                  </li>                    
                  <li class="fr-footer__content-item">
                      <a title="github du projet - nouvelle fenêtre" id="footer__content-link-6958" href="https://github.com/MaelQllt/PDI14_GeoCaptcha" target="_blank" rel="noopener external" class="fr-footer__content-link">github du projet</a>
                  </li>
              </ul>
          </div>
      </div>
      <div class="fr-footer__bottom">
          <ul class="fr-footer__bottom-list">
              <li class="fr-footer__bottom-item">
                  <a id="footer__bottom-link-6959" href="https://www.linkedin.com/in/maelquillat/" target="_blank" rel="noopener external" class="fr-footer__bottom-link">Quillat Maël</a>
              </li> 
               <li class="fr-footer__bottom-item">
                  <a id="footer__bottom-link-6962" href="https://www.linkedin.com/in/diegoposadobanuls/" target="_blank" rel="noopener external" class="fr-footer__bottom-link">Posado Bañuls Diego</a>
              </li>              
              <li class="fr-footer__bottom-item">
                  <a id="footer__bottom-link-6961" href="https://www.linkedin.com/in/lahigic/" target="_blank" rel="noopener external" class="fr-footer__bottom-link">Fofana Ibrahima</a>
              </li>
              <li class="fr-footer__bottom-item">
                  <a id="footer__bottom-link-6963" href="https://www.linkedin.com/in/cl%C3%A9ment-rathana/" target="_blank" rel="noopener external" class="fr-footer__bottom-link">Rathana Clément</a>
              </li>
          </ul>
          <div class="fr-footer__bottom-copy">
              <p>© IGN 2025 - Tous droits réservés - Géo CaptchAdmin, l'interface administrateur du GéoCaptcha de l'IGN</p>
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

.fr-logo{
  text-align: justify;
}  

.fr-footer__content{
  margin-right: 0px;
}
.fr-footer__content-desc {
  text-align: justify;
}

.footer-logo {
  width: 120px; /* Taille des logos */
  height: 120px;
  object-fit: contain; /* Pour garder le ratio des logos */
}

/* Centrer le logo du milieu */
.footer-logo.middle {
  margin-left: auto; /* Pousse les logos à gauche */
  margin-right: auto; /* Pousse les logos à droite */
}

.fr-footer__bottom-copy {
  width: 60%; /* ou une autre valeur adaptée */
  margin: 0 auto;
}



</style>