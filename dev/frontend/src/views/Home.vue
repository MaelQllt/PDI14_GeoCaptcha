<template>
  <div class="home">
    <!-- Section d'introduction expliquant le concept de GeoCaptcha -->
    <section class="fr-container fr-mt-5">
      <div class="fr-callout">
        <h1 class="fr-callout__title">GeoCaptcha - Sécurisation innovante</h1>
        <p class="fr-callout__text">
          Lorsque vous arrivez sur un site internet, il vous est souvent demandé si vous êtes un humain ou un robot. Pour prouver votre humanité, vous devez résoudre un captcha, souvent sous la forme de texte à déchiffrer ou de sélection d'images.
        </p>
        <p class="fr-callout__text">
          L'IGN, via la Mission Architecture Réseau et Sécurité (MARS), propose une innovation : les GéoCaptcha. Ces captchas reposent sur des données géographiques, offrant une alternative ludique et respectueuse de la vie privée tout en sensibilisant à la donnée géospatiale.
        </p>
        <p class="fr-callout__text">
          Grâce à cette interface, vous pouvez administrer les GéoCaptcha, consulter les statistiques d'utilisation et gérer les clés d'accès. Une solution clé en main pour renforcer la sécurité numérique et l'intégrité des données géographiques.
        </p>
      </div>
    </section>

    <!-- Section contenant l'image du captcha et le bouton d'interaction -->
    <section class="fr-container fr-my-5">
      <div class="logo-container">
        <form id="captcha-form" @submit.prevent="handleSubmit">
          <!-- Bouton pour tester un GeoCaptcha -->
          <button type="submit" class="fr-btn">Tester un GeoCaptcha</button>
          <!-- Message affiché après validation du captcha -->
          <p v-if="validationMessage" class="validation-message">{{ validationMessage }}</p>
        </form>
        <!-- Lien vers plus d'informations -->
        <p class="link-text">
          <a href="https://qlf-geocaptcha.ign.fr/api/v1/" target="_blank" rel="noopener noreferrer" class="fr-link">
            En savoir plus sur GeoCaptcha
          </a>
        </p>
      </div>
    </section>

    <!-- Message d'erreur si le chargement échoue -->
    <div v-if="loadingError" class="error-message">
      {{ loadingError }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      challengeId: null, 
      imageUrl: null, 
      validationMessage: null, 
      geoCaptchaLoaded: false, 
      apiKey: import.meta.env.VITE_API_KEY, 
      apiId: import.meta.env.VITE_API_ID, 
      apiBaseUrl: 'https://qlf-geocaptcha.ign.fr/api/v1' 
    };
  },
  methods: {
    // Charge dynamiquement le script GeoCaptcha
    async loadGeoCaptchaScript() {
      return new Promise((resolve, reject) => {
        // Vérifie si le script est déjà chargé
        if (document.querySelector(`script[src="${this.apiBaseUrl}/lib.js"]`)) {
          if (window.geoCaptcha) {
            this.geoCaptchaLoaded = true;
            resolve();
          } else {
            reject("Le script est chargé mais geoCaptcha est indisponible");
          }
          return;
        }

        console.log("Chargement du script GeoCaptcha...");
        const script = document.createElement('script');
        script.src = `${this.apiBaseUrl}/lib.js`;

        script.onload = () => {
          if (window.geoCaptcha) {
            this.geoCaptchaLoaded = true;
            resolve();
          } else {
            setTimeout(() => {
              if (window.geoCaptcha) {
                this.geoCaptchaLoaded = true;
                resolve();
              } else {
                reject("GeoCaptcha indisponible après chargement du script");
              }
            }, 1000);
          }
        };

        script.onerror = (error) => {
          console.error("Erreur de chargement du script:", error);
          reject("Erreur de chargement du script GeoCaptcha");
        };

        document.head.appendChild(script);
      });
    },

    
    // Valide un captcha en envoyant son token à l'API
    async validateCaptcha(token) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/challenge/${token}/validation`, {
          method: 'GET',
          headers: {
            'x-api-key': this.apiKey,
            'x-app-id': this.apiId,
          },
        });
        return response.ok;
      } catch (error) {
        return false;
      }
    },

    // Gère l'envoi du formulaire et lance GeoCaptcha
    handleSubmit() {
      if (!this.geoCaptchaLoaded || !window.geoCaptcha) {
        this.validationMessage = "Service GeoCaptcha non chargé. Veuillez réessayer.";
        return;
      }

      window.geoCaptcha.launch({
        form: document.getElementById('captcha-form'),
        submit: async (token) => {
          if (token) {
            await this.validateCaptcha(token);
          } else {
            this.validationMessage = "Aucun token généré.";
          }
        }
      });
    },

    // Initialise le captcha au chargement de la page
    async initCaptcha() {
      try {
        await this.loadGeoCaptchaScript();
        this.challengeId = await this.getChallengeId();
        if (this.challengeId) {
          this.imageUrl = await this.getCaptchaImage(this.challengeId);
        }
      } catch (error) {
        this.loadingError = `Erreur d'initialisation: ${error.message}`;
      }
    }
  },

  mounted() {
    window.scrollTo(0, 0);
    this.initCaptcha();
  }
};
</script>


<style scoped>
.home {
  padding-top: 170px;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
}

.challenge-img {
  max-width: 200px;
  height: auto;
  margin-bottom: 20px;
}

.validation-message {
  margin-top: 10px;
  font-weight: bold;
}

.error-message {
  margin-top: 10px;
  color: #dc3545;
  font-weight: bold;
  text-align: center;
}

.link-text {
  margin-top: 20px;
  text-align: center;
}

.fr-callout__text {
  text-align: justify;
}
</style>
