<template>
  <header class="fr-header">
    <div class="fr-container fr-header__body">
      <div class="fr-header__brand">
        <!-- Logo -->
        <a href="/" class="logo-container">
          <img :src="logo" alt="Logo" class="fr-logo" />
        </a>
      </div>
    </div>

    <!-- Navbar avec les boutons -->
    <nav class="fr-nav">
      <ul class="fr-nav__list">
        <li class="fr-nav__item">
          <router-link
            to="/dashboard"
            class="fr-btn"
            :class="{ active: activeButton === 'dashboard' }"
            @click="setActiveButton('dashboard')"
            >Gestion des GeoCaptchas</router-link
          >
        </li>
        <li class="fr-nav__item">
          <router-link
            to="/geo-captcha"
            class="fr-btn"
            :class="{ active: activeButton === 'geo-captcha' }"
            @click="setActiveButton('geo-captcha')"
            >Générer des GeoCaptchas</router-link
          >
        </li>
        <li class="fr-nav__item">
          <router-link
            to="/key-access"
            class="fr-btn"
            :class="{ active: activeButton === 'key-access' }"
            @click="setActiveButton('key-access')"
            >Gestion des clés d'accès</router-link
          >
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import logo from "@/assets/logo.svg"; // Chemin de ton logo

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
  z-index: 1000; /* Assure qu'il est au-dessus des autres éléments */
  background-color: #fff; /* Fond blanc */
  display: flex; /* Utilisation de flex pour gérer la disposition */
  justify-content: space-between; /* Logo à gauche et boutons à droite */
  padding: 0 0; /* Espacement autour du header */
  border-bottom: 0px solid #fff; /* Bordure sous le header */
  height: 100px; /* Hauteur du header */
}

/* Ajout de marge en haut du contenu pour ne pas être masqué par le header */
body {
  padding-top: 0px;
}

/* CONTAINER DU LOGO */
.fr-header__body {
  display: flex;
  justify-content: flex-start; /* Le logo à gauche */
  align-items: center;
  padding: 0 0rem; /* Espacement autour du logo */
}

/* LOGO */
.logo-container {
  display: flex;
  padding-left: 20px;
  justify-content: center;
  align-items: center;
}

.fr-logo {
  width: auto;
  height: 80px;
  object-fit: contain; /* Garde les proportions du logo */
}

/* Effet au survol du logo */
.logo-container:hover .fr-logo {
  transform: scale(1.1); /* Zoom de 10% */
}

/* NAV BAR (BOUTONS) */
.fr-nav {
  display: flex;
  align-items: stretch; /* Étire les boutons pour qu'ils occupent toute la hauteur du header */
  background-color: #fff; /* Fond blanc */
  width: 100%; /* Prend toute la largeur du header */
}

.fr-nav__list {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%; /* Prend toute la largeur de la zone de navigation */
  justify-content: space-between; /* Espace égal entre les boutons */
}

.fr-nav__item {
  flex: 1; /* Chaque bouton prend la même largeur */
}

/* BOUTON */
.fr-btn {
  width: 100%;
  height: 100px;
  padding: 0;
  margin: 0;
  font-size: 1rem;
  background-color: transparent !important;
  border: none !important;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #000 !important;
  text-align: center;
  outline: none !important;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: relative; /* Ajouté pour le positionnement de la ligne */
}

/* Effet au survol */
.fr-btn:hover {
  background-color: rgba(149, 226, 87, 0.5) !important; /* Arrière-plan vert transparent */
  color: #000 !important; /* Texte vert transparent */
}


.fr-btn:hover::after {
  content: ''; /* Crée un élément après le bouton */
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px; /* Épaisseur de la ligne */
  background-color: #68a532; /* Ligne verte foncée */
}

/* Effet au clic (focus) */
.fr-btn:active {
  background-color: rgba(149, 226, 87, 0.5) !important; /* Arrière-plan vert transparent quand on clique */
}

/* Style pour le bouton actif */
.fr-btn.active {
  background-color: #7fc04b!important; /* Couleur de fond vert pour le bouton actif */
  color: #fff !important; /* Texte en blanc pour le bouton actif */
}
</style>
