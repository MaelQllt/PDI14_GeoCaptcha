<template>
  <div class="home">
    <!-- Bloc d'introduction -->
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

    <!-- Bloc image/logo cliquable -->
    <section class="fr-container fr-my-5">
      <div class="logo-container">
        <form id="captcha-form" @submit.prevent="handleSubmit">
          <div v-if="imageUrl">
            <img :src="imageUrl" alt="Challenge Image" class="challenge-img" />
          </div>
          <!-- Bouton modifié avec les classes DSFR -->
          <button type="submit" class="fr-btn">Tester un GeoCaptcha</button>
          <p v-if="validationMessage" class="validation-message">{{ validationMessage }}</p>
        </form>
        <p class="link-text">
          <a href="https://qlf-geocaptcha.ign.fr/api/v1/" target="_blank" rel="noopener noreferrer" class="fr-link">
            En savoir plus sur GeoCaptcha
          </a>
        </p>
      </div>
    </section>

    <div v-if="loadingError" class="error-message">
      {{ loadingError }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

// Utilisez vos variables d'environnement ou placez directement les clés ici pour les tests
const apiKey = import.meta.env.VITE_API_KEY || 'VOTRE_API_KEY';
const apiId = import.meta.env.VITE_API_ID || 'VOTRE_API_ID';
// URL de base pour toutes les requêtes API
const apiBaseUrl = 'https://qlf-geocaptcha.ign.fr/api/v1';

const challengeId = ref(null);
const imageUrl = ref(null);
const validationMessage = ref(null);
const loadingError = ref(null);
const geoCaptchaLoaded = ref(false);

const loadGeoCaptchaScript = () => {
  return new Promise((resolve, reject) => {
    // Vérifier si le script est déjà chargé
    if (document.querySelector(`script[src="${apiBaseUrl}/lib.js"]`)) {
      if (window.geoCaptcha) {
        geoCaptchaLoaded.value = true;
        resolve();
      } else {
        // Le script est chargé mais l'objet n'est pas défini
        reject("Le script GeoCaptcha est chargé mais l'objet geoCaptcha n'est pas disponible");
      }
      return;
    }

    console.log("Chargement du script GeoCaptcha depuis:", `${apiBaseUrl}/lib.js`);

    const script = document.createElement('script');
    script.src = `${apiBaseUrl}/lib.js`;

    script.onload = () => {
      console.log('GéoCaptcha script loaded successfully');
      // Vérifier si l'objet geoCaptcha est défini après chargement
      if (window.geoCaptcha) {
        geoCaptchaLoaded.value = true;
        resolve();
      } else {
        // Attendre un peu si l'objet n'est pas immédiatement disponible
        setTimeout(() => {
          if (window.geoCaptcha) {
            geoCaptchaLoaded.value = true;
            resolve();
          } else {
            reject("Le script a été chargé mais l'objet geoCaptcha n'est pas disponible");
          }
        }, 1000); // Attendre 1 seconde
      }
    };

    script.onerror = (error) => {
      console.error("Erreur de chargement du script:", error);
      reject("Erreur lors du chargement du script GeoCaptcha");
    };

    document.head.appendChild(script);
  });
};

const getChallengeId = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/challenge?type=kingpin`, {
      headers: {
        'x-api-key': apiKey,
        'x-app-id': apiId,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération de l'ID de challenge (${response.status})`);
    }

    const data = await response.json();
    return data.challengeId;
  } catch (error) {
    console.error('Erreur:', error);
    loadingError.value = `Impossible d'obtenir un challenge: ${error.message}`;
    throw error;
  }
};

const getCaptchaImage = async (cId) => {
  try {
    const response = await fetch(`${apiBaseUrl}/challenge/${cId}`, {
      headers: {
        'Accept': 'image/png',
        'x-api-key': apiKey,
        'x-app-id': apiId,
      },
    });

    if (!response.ok) {
      // Ajouter des logs pour voir les détails de la réponse
      const errorText = await response.text();
      console.error(`Erreur détaillée: ${errorText}`);
      throw new Error(`Image non trouvée (${response.status})`);
    }

    return URL.createObjectURL(await response.blob());
  } catch (error) {
    console.error('Error fetching captcha image:', error);
    loadingError.value = `Impossible de charger l'image: ${error.message}`;
    return null;
  }
};

const validateCaptcha = async (token) => {
  try {
    const response = await fetch(`${apiBaseUrl}/challenge/${token}/validation`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'x-app-id': apiId,
      },
    });

    if (response.ok) {
      validationMessage.value = 'Captcha validé avec succès!';
      return true;
    } else {
      validationMessage.value = `Échec de la validation du captcha (${response.status}).`;
      return false;
    }
  } catch (error) {
    console.error('Error validating captcha:', error);
    validationMessage.value = `Erreur lors de la validation du captcha: ${error.message}`;
    return false;
  }
};

const handleSubmit = (event) => {
  if (!geoCaptchaLoaded.value || !window.geoCaptcha) {
    validationMessage.value = "Le service GeoCaptcha n'est pas encore chargé. Veuillez réessayer.";
    return;
  }

  window.geoCaptcha.launch({
    form: document.getElementById('captcha-form'),
    submit: async (token) => {
      if (token) {
        await validateCaptcha(token);
      } else {
        validationMessage.value = "Aucun token n'a été généré.";
      }
    }
  });
};

const initCaptcha = async () => {
  try {
    console.log("Initialisation du captcha");

    // Charger le script GeoCaptcha
    await loadGeoCaptchaScript();
    console.log("Script GeoCaptcha chargé avec succès");

    // Obtenir un challenge ID
    challengeId.value = await getChallengeId();
    console.log("Challenge ID obtenu:", challengeId.value);

    // Charger l'image du captcha
    if (challengeId.value) {
      imageUrl.value = await getCaptchaImage(challengeId.value);
      console.log("Image URL:", imageUrl.value ? "obtenue" : "non obtenue");

      if (!imageUrl.value) {
        loadingError.value = "Impossible de charger l'image du captcha.";
      }
    }
  } catch (error) {
    console.error('Erreur d\'initialisation:', error);
    loadingError.value = `Erreur d'initialisation du captcha: ${error.message}`;
  }
};

onMounted(() => {
  window.scrollTo(0, 0);
  console.log("Composant monté, initialisation du captcha");
  initCaptcha();
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
  flex-direction: column;
}

.challenge-img {
  max-width: 200px;
  height: auto;
  margin-bottom: 20px;
}

/* Suppression des styles personnalisés du bouton car nous utilisons maintenant les classes DSFR */
/* .validate-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.validate-button:hover {
  background-color: #0056b3;
} */

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