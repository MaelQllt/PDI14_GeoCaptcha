<template>
  <div class="home">
    <!-- Bloc d'introduction -->
    <section class="intro">
      <div class="fr-container">
        <h1 class="fr-title">GeoCaptcha - Interface Administrateur</h1>
        <p class="fr-text">
          Lorsque vous arrivez sur un site internet, il vous est souvent demandé si vous êtes un
          humain ou un robot. Pour prouver votre humanité vous devez résoudre un captcha, la plu-
          part du temps sous la forme de déchiffrage de texte ou bien de séquence d’images. L’IGN,
          par la Mission Architecture Réseau et Sécurité (MARS), a conçu un système novateur
          dans ce domaine, les GéoCaptcha. Ces captchas reposent sur des données géographiques,
          l’objectif est de proposer aux utilisateurs un nouveau type de captcha qui se veut ludique
          et respectueux de la vie privée tout en sensibilisant le public à la donnée géospatiale.
</p>
        <p class="fr-text">
          Grâce à cette interface, vous pourrez administrer l’ensemble des GeoCaptchas, consulter les statistiques sur leur utilisation et gérer les clés d'accès des utilisateurs. 
          Une solution clé en main pour garantir la sécurité et l'intégrité des données géographiques tout en optimisant l'expérience utilisateur.
        </p>
      </div>
    </section>

    <!-- Bloc image/logo cliquable -->
    <section class="logo-section">
      <div class="fr-container">
        <a href="https://qlf-geocaptcha.ign.fr/api/v1/" target="_blank" rel="noopener noreferrer">
          <img src="@/assets/logo.png" alt="Logo GeoCaptcha" class="logo-img" />
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
// Aucun changement nécessaire ici
</script>

<style scoped>
/* Assurer que le contenu commence sous le header */
.home {
  padding-top: 110px; /* Hauteur du header + marge de sécurité */
  padding-bottom: 2rem; /* Assurer un espace avant le footer */
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Section d'introduction */
.intro {
  background-color: #f5f5f5;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px; /* Limite la largeur du bloc */
  margin-bottom: 2rem;
}

.fr-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #90c149;
  text-align: center; /* Centrage du titre */
}

.fr-text {
  font-size: 1rem;
  line-height: 1.5;
  color: #555;
  margin-bottom: 1.5rem;
  text-align: center; /* Centrage du texte */
}

/* Section image/logo */
.logo-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-img {
  width: 200px; /* Ajuste la taille du logo */
  height: auto;
  max-width: 100%;
}
</style>




