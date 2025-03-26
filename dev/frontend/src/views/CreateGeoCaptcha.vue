<template>
  <div class="generation">
    <h1 class="fr-h1">Créez vos GéoCaptchas</h1>
    <form @submit.prevent="validateAndCreateGeoCaptcha">
      <div class="fr-input-group">
        <fieldset class="fr-fieldset" id="radio" aria-labelledby="radio-legend radio-messages">
          <label-choix class="fr-fieldset__legend--regular fr-fieldset__legend" id="radio-legend">
            Choix de la zone géographique :
          </label-choix>
          <div class="fr-fieldset__element">
            <div class="fr-radio-group">
              <input value="1" type="radio" id="radio-1" name="radio" @click="closeDepartement" :disabled="isSuccess">
              <label class="fr-label" for="radio-1">
                  Aléatoire
              </label>
            </div>
          </div>
          <div class="fr-fieldset__element">
            <div class="fr-radio-group">
              <input value="2" type="radio" id="radio-2" name="radio" @click="openDepartement" :disabled="isSuccess">
              <label class="fr-label" for="radio-2">
                  Département
              </label>
            </div>
          </div>
          <div class="fr-messages-group" id="radio-messages" aria-live="polite">
          </div>
        </fieldset>
        <p v-if="!isDepartement">Le GéoCaptcha sera généré avec une localisation aléatoire en France.</p>
        <p v-if="isDepartement">Le GéoCaptcha sera généré dans le département de France que vous aurez choisi.</p>
        <select id="departement" v-model="selectedDepartement" class="fr-select" :class="{ hidden: !isDepartement }" :required="isDepartement">
          <option value="" disabled selected>Choisissez votre département</option>
          <option v-for="dept in departements" :key="dept.code" :value="dept.code">
            {{ dept.nom }} ({{ dept.code }})
          </option>
        </select>

        <div v-if="!isDepartement && randomDepartement" class="fr-input-group">
          <label class="fr-label" for="random-departement">Département aléatoire :</label>
          <input type="text" id="random-departement" v-model="randomDepartement.nom" class="fr-input" readonly />
        </div>

        <div class="fr-input-group">
          <label class="fr-label" for="latitude">Latitude :</label>
          <input type="number" step="any" id="latitude" v-model="latitude" class="fr-input" :placeholder="latitudePlaceholder" required />
          <p v-if="latitudeError" class="fr-error-text">{{ latitudeError }}</p>
        </div>

        <div class="fr-input-group">
          <label class="fr-label" for="longitude">Longitude :</label>
          <input type="number" step="any" id="longitude" v-model="longitude" class="fr-input" :placeholder="longitudePlaceholder" required />
          <p v-if="longitudeError" class="fr-error-text">{{ longitudeError }}</p>
        </div>

        <!-- Nouveaux champs pour zipcode et mode -->
        <div class="fr-input-group">
          <label class="fr-label" for="zipcode">Zipcode :</label>
          <input type="text" id="zipcode" v-model="zipcode" class="fr-input" placeholder="Entrez un code postal" required />
        </div>

        <div class="fr-input-group">
          <label class="fr-label" for="mode">Mode :</label>
          <select id="mode" v-model="mode" class="fr-select" required>
            <option value="" disabled selected>Choisissez un mode</option>
            <option value="ortho">ortho</option>
            <option value="plan">plan</option>
            <option value="scan">Scan</option>
          </select>
        </div>

        <div v-if="isSuccess" id="alert-1068" class="fr-alert fr-alert--success">
          <h3 class="fr-alert__title">Succès de la création</h3>
          <p v-if="isDepartement">{{ successMessage }}</p>
          <p v-else>GéoCaptcha créé avec une localisation aléatoire en France.</p>
        </div>
      </div>
      <button type="submit" class="fr-btn">Générer</button>

      <div v-if="isModalOpen" class="modal-overlay">
        <div class="modal-content" @click.stop>
          <div class="fr-container fr-container--fluid fr-container-md">
            <div class="fr-grid-row fr-grid-row--center">
              <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
                <div class="fr-modal__body">
                  <div class="fr-modal__content">
                    <h1 id="modal-overlay-title" class="fr-modal__title">
                      Vous avez généré ce GéoCaptcha :
                    </h1>
                    <div class="image-container">
                      <img :src="imageTuile" alt="geocaptcha" v-if="imageTuile">
                      <p v-else>Chargement de l'image...</p>
                    </div>
                  </div>
                  <div class="fr-modal__footer">
                    <div class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                      <button type="button" id="button-6047" class="fr-btn fr-icon-checkbox-circle-line fr-btn--icon-left" @click="handleConserver">Conserver</button>
                      <button type="button" id="button-6048" class="fr-btn" @click="closeModal">Supprimer</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      difficulty: 'easy',
      selectedDepartement: "",
      departements: [],
      isModalOpen: false,
      isDepartement: false,
      isSuccess: false,
      successMessage: "",
      latitude: "",
      longitude: "",
      randomDepartement: null,
      latitudePlaceholder: "Entrez une latitude",
      longitudePlaceholder: "Entrez une longitude",
      latitudeMin: null,
      latitudeMax: null,
      longitudeMin: null,
      longitudeMax: null,
      latitudeError: "",
      longitudeError: "",
      zipcode: "",
      mode: "",
      zipcodeError: "",
      modeError: "",
      imageTuile: "",
    };
  },

  computed: {
    availableDepartements() {
      return this.departements.filter(dept => dept.disponibilite === "Disponible");
    }
  },

  watch: {
    selectedDepartement(newValue) {
      if (newValue) {
        this.fetchDepartmentBoundary(newValue);
      }
    }
  },

  mounted() {
    this.recupDepartementFrance();
  },

  methods: {
    validateAndCreateGeoCaptcha() {
      this.latitudeError = "";
      this.longitudeError = "";
      this.zipcodeError = ""; // Initialisation de l'erreur zipcode
      this.modeError = ""; // Initialisation de l'erreur mode

      // Vérifier que les champs sont remplis
      if (!this.latitude || !this.longitude || !this.zipcode || !this.mode) {
        if (!this.latitude) this.latitudeError = "La latitude est obligatoire.";
        if (!this.longitude) this.longitudeError = "La longitude est obligatoire.";
        if (!this.zipcode) this.zipcodeError = "Le zipcode est obligatoire.";
        if (!this.mode) this.modeError = "Le mode est obligatoire.";
        return;
      }

      // Convertir les valeurs en nombres décimaux
      const lat = parseFloat(this.latitude);
      const lon = parseFloat(this.longitude);

      // Vérifier que les valeurs sont des nombres valides
      if (isNaN(lat)) {
        this.latitudeError = "La latitude doit être un nombre valide.";
        return;
      }
      if (isNaN(lon)) {
        this.longitudeError = "La longitude doit être un nombre valide.";
        return;
      }

      // Vérifier que les valeurs sont dans les limites
      if (lat < this.latitudeMin || lat > this.latitudeMax) {
        this.latitudeError = `La latitude doit être entre ${this.latitudeMin} et ${this.latitudeMax}.`;
        return;
      }

      if (lon < this.longitudeMin || lon > this.longitudeMax) {
        this.longitudeError = `La longitude doit être entre ${this.longitudeMin} et ${this.longitudeMax}.`;
        return;
      }

      // Si tout est valide, créer le GéoCaptcha
      this.createGeoCaptcha();
    },

    async createGeoCaptcha() {
      // Convertir les coordonnées latitude/longitude en coordonnées de tuile
      const tileCoords = this.latLonToTile(this.latitude, this.longitude, 17); // z = 17 (niveau de zoom)
      console.log("Coordonnées de la tuile :", tileCoords);

      // Préparer les données pour l'API
      const data = {
        id: this.generateUniqueId(),
        x: tileCoords.x,
        y: tileCoords.y,
        z: 17,
        zipcode: this.zipcode,
        mode: this.mode,
        ok: "1"
      };
      console.log("Données envoyées à l'API :", data);

      try {
        // Envoyer la requête POST à l'API
        const response = await fetch("https://qlf-geocaptcha.ign.fr/api/v1/admin/kingpin", {
          method: "POST",
          headers: {
            "Accept": "*/*",
            "content-type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
            "x-app-id": import.meta.env.VITE_API_ID,
          },
          body: JSON.stringify(data),
        });
        console.log(response);

        if (!response.ok) {
          throw new Error("Erreur lors de la création du GéoCaptcha");
        }

        const result = await response.json();
        console.log("Réponse de l'API :", result);

        this.successMessage = `GéoCaptcha créé avec succès ! ID : ${data.id}`;
        this.isSuccess = true;
        setTimeout(() => {
          this.isSuccess = false;
        }, 3000);
        this.imageTuile = `https://tile.openstreetmap.org/${data.z}/${data.x}/${data.y}.png`
        this.isModalOpen = true;
      } catch (error) {
        console.error("Erreur :", error);
      }
    },

    // Convertir latitude/longitude en coordonnées de tuile
    latLonToTile(lat, lon, z) {
      const x = Math.floor((lon + 180) / 360 * Math.pow(2, z));
      const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));
      console.log(x, y);
      return { x, y };
    },

    // Générer un ID unique
    generateUniqueId() {
      return Math.floor(Math.random() * 100000).toString();
    },

    async recupDepartementFrance() {
      try {
        const response = await fetch("https://geo.api.gouv.fr/departements");

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des départements");
        }

        const resultats = await response.json();
        this.departements = resultats;
      } catch (err) {
        console.error("Erreur :", err);
      }
    },

    openModal() {
      this.isModalOpen = true;
      document.body.style.overflow = 'hidden';
    },

    closeModal() {
      this.isModalOpen = false;
      document.body.style.overflow = 'auto';
    },

    openDepartement() {
      this.isDepartement = true;
      this.randomDepartement = null;
    },

    closeDepartement() {
      this.isDepartement = false;
      this.selectRandomDepartement();
    },

    selectRandomDepartement() {
      if (this.departements.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.departements.length);
        this.randomDepartement = this.departements[randomIndex];
        this.fetchDepartmentBoundary(this.randomDepartement.code);
      }
    },

    async fetchDepartmentBoundary(codeDepartement) {
      try {
        const communesUrl = `https://geo.api.gouv.fr/communes?codeDepartement=${codeDepartement}&format=geojson&geometry=contour`;
        const communesResponse = await fetch(communesUrl);
        if (!communesResponse.ok) throw new Error(`Erreur pour le département ${codeDepartement}`);

        const communesData = await communesResponse.json();

        if (communesData.features) {
          const bounds = this.calculateBounds(communesData);
          this.latitudePlaceholder = `Entrez une latitude entre ${bounds.latMin} et ${bounds.latMax}`;
          this.longitudePlaceholder = `Entrez une longitude entre ${bounds.lonMin} et ${bounds.lonMax}`;
          this.latitudeMin = bounds.latMin;
          this.latitudeMax = bounds.latMax;
          this.longitudeMin = bounds.lonMin;
          this.longitudeMax = bounds.lonMax;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des limites du département :', error);
      }
    },

    calculateBounds(geoJsonData) {
      let latMin = 90, latMax = -90, lonMin = 180, lonMax = -180;

      geoJsonData.features.forEach(feature => {
        feature.geometry.coordinates.forEach(polygon => {
          polygon.forEach(coord => {
            const [lon, lat] = coord;
            if (lat < latMin) latMin = lat;
            if (lat > latMax) latMax = lat;
            if (lon < lonMin) lonMin = lon;
            if (lon > lonMax) lonMax = lon;
          });
        });
      });

      return { latMin, latMax, lonMin, lonMax };
    },

    handleConserver() {
      this.closeModal();
      this.createGeoCaptcha();
    }
  }
}
</script>


<style scoped>
.generation {
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: left;
  min-height: calc(100vh - 200px); /* Soustraire la hauteur approximative du header */
  text-align: left;
  margin-left: 8em;
  margin-right: 8em;
  padding-top: 200px; /* Ajouter un padding en haut pour compenser le header */
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.fr-btn {
  margin-top: 20px;
  align-self: center;
  background-color: #7fc04b;
}

.fr-btn:hover {
  background-color: #68a532;
}

.fr-input:focus,
.fr-select:focus {
  outline: 2px solid #7fc04b;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%; /* Augmentez cette valeur selon vos besoins */
  max-width: 1200px; /* Ajustez la largeur maximale */
  max-height: 90vh; /* 90% de la hauteur de l'écran */
  background: white;
  border-radius: 8px;
  padding: 2em;
  overflow-y: auto; /* Permet le scrolling si le contenu est trop grand */
}

.image-container {
  width: 100%;
  height: 70vh; /* Ajustez la hauteur selon vos besoins */
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em 0;
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.fr-modal__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.fr-modal__title {
  margin-bottom: 1em;
  text-align: center;
}
.modal {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}




.fr-modal__content img {
  object-fit: contain;
}
.modal-content {
  padding: 1em;
}


#button-6048 {
  background-color: #f44336;
  color: white;
}

#button-6048:hover {
  background-color: #da190b;
}

label-choix {
  margin-top: 20px;
}

.hidden {
  visibility: hidden;
  opacity: 0;
}

p {
  width: 95%;
}

.fr-input-group {
  min-width: 300px;
  max-width: 500px;
  width: 100%; /* Il prendra toute la place dispo mais restera dans les limites */
}

#alert-1068 {
  margin-top:1em;
}

.fr-error-text {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

</style>