<template>
  <header role="banner" class="fr-header">
    <!-- En-tête fixe avec logo, menu et liens de navigation vers les fonctionnalités-->
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand fr-enlarge-link">
            <div class="fr-header__brand-top">
              <div class="fr-header__operator">
                <!-- Logo avec attribut alt à renseigner -->
                <img class="fr-responsive-img" style="max-width:5rem;" :src="logo" alt="Logo de l'interface" />
              </div>
            </div>
            <div class="fr-header__service">
              <!-- Lien vers la page d'accueil -->
              <router-link
                to="/"
                class="fr-header__service-title"
                :class="{ active: activeButton === '' }"
                @click="setActiveButton('')"
              >
                CaptchaAdmin
                <span class="fr-badge fr-badge--sm fr-badge--green-emeraude">BETA</span>
              </router-link>
              <p class="fr-header__service-tagline">Interface Administrateur du GéoCaptcha</p>
            </div>
          </div>
          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <!-- Liste des liens de navigation -->
              <ul class="fr-btns-group">
                <li>
                  <router-link
                    to="/geo-captcha"
                    class="fr-btn fr-icon-earth-fill fr-btn"
                    :class="{ active: activeButton === 'geo-captcha' }"
                    @click="setActiveButton('geo-captcha')"
                  >
                    Générer un GeoCaptcha
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/dashboard"
                    class="fr-btn fr-icon-dashboard-3-line fr-btn"
                    :class="{ active: activeButton === 'dashboard' }"
                    @click="setActiveButton('dashboard')"
                  >
                    Tableau de Bord
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/key-access"
                    class="fr-btn fr-icon-user-setting-fill"
                    :class="{ active: activeButton === 'key-access' }"
                    @click="setActiveButton('key-access')"
                  >
                    Gestion des clés d'accès
                  </router-link>
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
import logo from "@/assets/logo.png"; // Chemin du logo de l'interface

// Variable pour suivre l'état du bouton actif
const activeButton = ref('');

// Fonction pour définir le bouton actif
function setActiveButton(button) {
  activeButton.value = button;
}
</script>

<style scoped>
@import "@gouvfr/dsfr/dist/dsfr.min.css";

/* HEADER FIXÉ */
.fr-header {
  position: fixed;
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
  background-color: rgb(18, 18, 255) !important;
  color: #ffffff !important;
}

/* Effet au clic (focus) */
.fr-btn:active {
  background-color: rgb(220, 220, 252) !important;
}

/* Style pour le bouton actif */
.fr-btn.active {
  background-color: rgb(0, 0, 145) !important;
  color: #fff !important;
}

/* STYLES EN MODE SOMBRE */
:root[data-fr-theme="dark"] .fr-btn {
  color: #ffffff !important;
}

:root[data-fr-theme="dark"] .fr-btn:hover {
  background-color: rgb(177, 177, 249) !important;
  color: #ffffff !important;
}

:root[data-fr-theme="dark"] .fr-btn:active {
  background-color: rgb(198, 198, 251) !important;
}

:root[data-fr-theme="dark"] .fr-btn.active {
  background-color: rgb(133, 133, 246) !important;
  color: rgb(0, 0, 145) !important;
}
</style>
