<template>
  <div class="home">

    <!-- Bloc d'introduction -->
    <section class="fr-container fr-mt-5">
      <div class="fr-callout">
        <h1 class="fr-callout__title">GeoCaptcha - Sécurisation innovante</h1>
        <p class="fr-callout__text">
          Lorsque vous arrivez sur un site internet, il vous est souvent demandé si vous êtes un humain ou un robot. Pour prouver votre humanité, vous devez résoudre un captcha, souvent sous la forme de texte à déchiffrer ou de sélection d’images.
        </p>
        <p class="fr-callout__text">
          L’IGN, via la Mission Architecture Réseau et Sécurité (MARS), propose une innovation : les GéoCaptcha. Ces captchas reposent sur des données géographiques, offrant une alternative ludique et respectueuse de la vie privée tout en sensibilisant à la donnée géospatiale.
        </p>
        <p class="fr-callout__text">
          Grâce à cette interface, vous pouvez administrer les GéoCaptcha, consulter les statistiques d’utilisation et gérer les clés d'accès. Une solution clé en main pour renforcer la sécurité numérique et l’intégrité des données géographiques.
        </p>
      </div>
    </section>

    <!-- Bloc image/logo cliquable -->
    <section class="fr-container fr-my-5">
      <div class="logo-container">
        <a href="https://qlf-geocaptcha.ign.fr/api/v1/" target="_blank" rel="noopener noreferrer">
          <img src="@/assets/logo.png" alt="Logo GeoCaptcha" class="logo-img">
        </a>
      </div>
    </section>

  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<style scoped>
/* Ajouter un padding sous le header pour éviter un chevauchement */
.home {
  padding-top: 170px;
}

/* Centrage du logo */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.logo-img {
  max-width: 200px;
  height: auto;
}

.fr-callout__text {
  text-align: justify;
}
</style>