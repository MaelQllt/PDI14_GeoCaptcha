<template>
    <div class="switch-theme-form-group">
      <!-- Formulaire pour changer le thème entre light et dark-->
      <fieldset class="fr-fieldset">
        <div class="fr-fieldset__element">
          <div class="fr-toggle">
            <!-- Bouton pour basculer entre les thèmes -->
            <button
              @click="toggleTheme"
              class="fr-display-button fr-background-default--grey fr-btn fr-icon-theme-fill fr-btn--secondary fixed-theme-btn"
              aria-controls="fr-theme-modal"
              data-fr-opened="false"
            >
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      toggleTheme() {
        // Récupère le thème actuel et bascule entre dark et light
        const currentTheme = document.documentElement.getAttribute("data-fr-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
  
        // Met à jour l'attribut du thème et le style de couleur
        document.documentElement.setAttribute("data-fr-theme", newTheme);
        document.documentElement.style.colorScheme = newTheme;
  
        // Sauvegarde le nouveau thème dans le stockage local
        localStorage.setItem("scheme", newTheme);
      }
    },
  
    mounted() {
      // Définition des constantes pour les thèmes
      const themeSystem = "system";
      const themeDark = "dark";
      const defaultTheme = "dark";
      const attrTheme = "data-fr-theme";
      const attrScheme = "data-fr-scheme";
  
      // Fonction pour appliquer le thème sombre
      const applyDarkTheme = () => {
        document.documentElement.setAttribute(attrTheme, defaultTheme);
        document.documentElement.style.colorScheme = "dark";
      };
  
      // Vérifie la préférence du système pour le thème sombre
      const checkSystemPreference = () => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          applyDarkTheme();
        }
      };
  
      // Récupère le thème stocké ou la préférence actuelle du système
      const storedTheme = localStorage.getItem("scheme") || "";
      const currentScheme = document.documentElement.getAttribute(attrScheme);
  
      // Applique le thème en fonction des conditions
      switch (true) {
        case storedTheme === themeDark:
          applyDarkTheme();
          break;
        case storedTheme === themeSystem:
          checkSystemPreference();
          break;
        case currentScheme === themeDark:
          applyDarkTheme();
          break;
        case currentScheme === themeSystem:
          checkSystemPreference();
          break;
      }
    }
  };
  </script>
  
  <style scoped>
  .fixed-theme-btn {
    position: fixed;
    right: 30px;
    bottom: 30px;
    z-index: 9999;
    border-radius: 8px;
    background-color: #f0f0f0;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  </style>
  