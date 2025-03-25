<template>


  <header role="banner" class="fr-header">
    <div class="fr-header__body">
        <div class="fr-container">
            <div class="fr-header__body-row">
                <div class="fr-header__brand fr-enlarge-link">
                    <div class="fr-header__brand-top">
                        <div class="fr-header__operator">
                            <img class="fr-responsive-img" style="max-width:5rem;" :src="logo" alt="À MODIFIER">
                            <!-- L’alternative de l’image (attribut alt) doit impérativement être renseignée et reprendre le texte visible dans l’image -->
                        </div> 
                        <div class="fr-header__navbar">
                            <button data-fr-opened="false" aria-controls="modal-2186" title="Menu" type="button" id="button-2187" class="fr-btn--menu fr-btn">Menu</button>
                        </div>
                    </div>
                    <div class="fr-header__service">
                      <router-link
                            to="/"
                            class="fr-header__service-title"
                            :class="{ active: activeButton === '' }"
                            @click="setActiveButton('')"
                            >CaptchaAdmin
                            <span class="fr-badge fr-badge--sm fr-badge--green-emeraude">BETA</span>
                          </router-link>
                        <p class="fr-header__service-tagline">Interface Administrateur du GéoCaptcha</p>
                    </div>
                </div>
                <div class="fr-header__tools">
                    <div class="fr-header__tools-links">
                      <ul class="fr-btns-group">
                        <li>
                          <router-link
                            to="/geo-captcha"
                            class="fr-btn fr-icon-earth-fill fr-btn"
                            :class="{ active: activeButton === 'geo-captcha' }"
                            @click="setActiveButton('geo-captcha')"
                            >Générer un GeoCaptcha</router-link
                          >
                        </li>
                        <li>
                          <router-link
                            to="/dashboard"
                            class="fr-btn fr-icon-dashboard-3-line fr-btn"
                            :class="{ active: activeButton === 'dashboard' }"
                            @click="setActiveButton('dashboard')"
                            >Tableau de Bord</router-link
                          >
                        </li>
                        <li>
                          <router-link
                            to="/key-access"
                            class="fr-btn fr-icon-user-setting-fill"
                            :class="{ active: activeButton === 'key-access' }"
                            @click="setActiveButton('key-access')"
                            >Gestion des clés d'accès</router-link
                          >
                        </li>
                      </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </header>
</template>

<script setup>
import { ref } from 'vue';
import logo from "@/assets/logo.png"; // Chemin de ton logo

// Variable pour suivre l'état du bouton actif
const activeButton = ref('');

// Fonction pour définir le bouton actif
function setActiveButton(button) {
  activeButton.value = button;
}
</script>

<style scoped>
@import "@gouvfr/dsfr/dist/dsfr.min.css"; /* Importation du DSFR */

/* HEADER FIXÉ */
.fr-header {
  position: fixed; /* Fixe le header en haut */
  top: 0;
  left: 0;
  width: 100%;
}

/* BOUTON */
.fr-btn {
  transition: all 0.3s ease;
}

/* Effet au survol */
.fr-btn:hover {
  background-color: rgb(18,18,255)!important; /* Arrière-plan vert transparent */
  color: #ffffff !important; /* Texte vert transparent */
}

/* Effet au clic (focus) */
.fr-btn:active {
  background-color: rgb(220,220,252) !important; /* Arrière-plan vert transparent quand on clique */
}

/* Style pour le bouton actif */
.fr-btn.active {
  background-color: rgb(0,0,145) !important; /* Couleur de fond vert pour le bouton actif */
  color: #fff !important; /* Texte en blanc pour le bouton actif */
}
</style>
