<template>
  <div class="generation">
      <h1 class="fr-h1">Générer un GéoCaptcha</h1>
  </div>
    <div class="geo-captcha">
      <div class="fr-container fr-container--fluid fr-mb-md-14v">
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
          <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <div class="fr-container fr-background-alt--grey fr-px-md-0 fr-pt-10v fr-pt-md-14v fr-pb-6v fr-pb-md-10v">
              <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
                <div class="fr-col-12 fr-col-md-9 fr-col-lg-8">
                  <label class="fr-label label_param" for="select-hint">
                    <span class="fr-h4">Paramètres de génération</span>
                    <span class="fr-hint-text">En choisissant Zone Géographique vous pourrez obtenir un GéoCaptcha spécifique à un département.</span>
                  </label>
                    <form @submit.prevent="validateAndCreateGeoCaptcha">
                      <div class="fr-input-group">

                          <fieldset class="fr-segmented">
                              <div class="fr-segmented__elements">
                                <div class="fr-segmented__element">
                                  <input value="1" v-model="selectedOption" @click="openDepartement" checked type="radio" id="segmented-2073-2" name="segmented-2073">
                                  <label class="fr-icon-road-map-line fr-label" for="segmented-2073-2">
                                    Zone Géographique précise
                                  </label>
                                </div>
                                <div class="fr-segmented__element">
                                  <input value="2" v-model="selectedOption" @click="closeDepartement" type="radio" id="segmented-2073-1" name="segmented-2073">
                                  <label class="fr-icon-question-line fr-label" for="segmented-2073-1">
                                    Aléatoire
                                  </label>
                                </div>
                              </div>
                            </fieldset>

                        <p v-if="selectedOption === '2'" class="choix-zone">Le GéoCaptcha sera généré avec une localisation aléatoire en France.</p>
                        <p v-if="selectedOption === '1'" class="choix-zone">Le GéoCaptcha sera généré dans le département de France que vous aurez choisi.</p>
                        <select id="departement" v-model="selectedDepartement" class="fr-select" :class="{ hidden: !isDepartement }" :required="isDepartement">
                          <option value="" disabled selected>Choisissez votre département</option>
                          <option v-for="dept in departements" :key="dept.code" :value="dept.code">
                            {{ dept.nom }} ({{ dept.code }})
                          </option>
                        </select>

                        <div v-if="selectedOption === '1'">
                            <div class="fr-select-group">
                              <label class="fr-label" for="select">Choix du département:</label>
                                <select class="fr-select" id="select" name="select" v-model="selectedDepartement">
                                  <option value="" selected disabled hidden>Sélectionner un département</option>
                                  <option v-for="dept in departements" :key="dept.code" :value="dept.code">
                                  {{ dept.code }} - {{ dept.nom }}
                                </option>
                              </select>
                              <div class="fr-input-group">
                                <label class="fr-label lat-format" for="latitude">Latitude :</label>
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
                          </div>
                        </div>

                        <div v-if="selectedOption === '2'">

                          <div class="fr-input-group">
                          <label class="fr-label" for="random-departement">Département aléatoire :</label>
                          <input type="text" id="random-departement" v-model="randomDepartement.nom" class="fr-input" readonly /></div>

                          <div class="fr-input-group">
                          <label class="fr-label lat-format" for="latitude">Latitude :</label>
                          <input type="number" step="any" id="latitude" v-model="latitude" class="fr-input" :placeholder="latitudePlaceholder" readonly /></div>

                          <div class="fr-input-group">
                          <label class="fr-label" for="longitude">Longitude :</label>
                          <input type="number" step="any" id="longitude" v-model="longitude" class="fr-input" :placeholder="longitudePlaceholder" readonly /></div>

                          <div class="fr-input-group">
                          <label class="fr-label" for="zipcode">Zipcode :</label>
                          <input type="text" id="zipcode" v-model="zipcode" class="fr-input" readonly /></div>
                        </div>

                        <div class="fr-input-group mode-format">
                          <label class="fr-label" for="mode">Mode :</label>
                          <select id="mode" v-model="mode" class="fr-select" required>
                            <option value="" disabled selected>Choisissez un mode</option>
                            <option value="ortho">Ortho</option>
                            <option value="plan">Plan</option>
                            <option value="scan">Scan</option>
                          </select>
                        </div>

                        <div class="button-container">
                          <div v-if="selectedOption === '2'" class="tooltip-container">
                              <button @mouseover="showTooltip" @mouseleave="hideTooltip" class="fr-btn--tertiary-no-outline fr-icon-information-line"></button>
                              <span v-if="isTooltipVisible" class="custom-tooltip">
                                En recliquant sur Aléatoire ci-haut, vous pourrez générer un nouveau GéoCaptcha aléatoire.
                              </span>
                            </div>

                          <button type="submit" class="fr-btn btn-generer">Générer</button>
                        </div>
                        <div v-if="isSuccess" id="alert-1068" class="fr-alert fr-alert--success">
                          <h3 class="fr-alert__title">Succès de la création</h3>
                          <p v-if="isDepartement">{{ successMessage }}</p>
                          <p v-else>GéoCaptcha créé avec une localisation en France.</p>
                        </div>

                        <div v-if="isRefuse" id="alert-1068" class="fr-alert fr-alert--info">
                          <h3 class="fr-alert__title">Tuile refusée</h3>
                          <p v-if="isDepartement">{{ successMessage }}</p>
                          <p v-else>GéoCaptcha non enregistré.</p>
                        </div>
                      </div>


                      <div v-if="isModalOpen" class="modal-overlay">
                          <div class="fr-container fr-container--fluid fr-container-md">
                            <div class="fr-grid-row fr-grid-row--center">
                              <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
                                <div class="fr-modal__body">
                                  <div class="fr-modal__header">
                                    <button @click="closeModal" aria-controls="modal-6053" title="Fermer" type="button" id="button-6054" class="fr-btn--close fr-btn">Fermer</button>
                                  </div>

                                  <div class="fr-modal__content">
                                    <h1 id="modal-6053-title" class="fr-modal__title">
                                        <span class="fr-icon-arrow-right-line fr-icon--lg" aria-hidden="true"></span>
                                        GéoCaptcha généré :
                                    </h1>
                                    <p>Voici un GéoCaptcha correspondant à la zone géographique choisi: </p>
                                    <div class="image-container">
                                      <img :src="imageTuile" alt="geocaptcha" v-if="imageTuile">
                                      <p v-else>Chargement de l'image...</p>
                                    </div>
                                  </div>
                                  <div class="fr-modal__footer">
                                    <div class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                                        <button @click="handleConserver" type="button" id="button-6047" class="accept-btn fr-btn fr-icon-checkbox-circle-line fr-btn--icon-left">Accepter</button>
                                        <button @click="closeModal" type="button" id="button-6048" class="refuse-btn fr-btn fr-icon-close-circle-line fr-btn--icon-left fr-btn--tertiary">Refuser</button>
                                    </div>
                                  </div>


                                </div>
                              </div>
                            </div>
                          </div>
                      </div>
                    </form>
                  </div>
        </div>
              </div> 
            </div> 
          </div> 
        </div>
      </div>

</template>

<script>
export default {
  data() {
    return {
      selectedOption: "1",
      selectedDepartement: "",
      departements: [],
      isModalOpen: false,
      isDepartement: false,
      isSuccess: false,
      isRefuse: false,
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
      isTooltipVisible: false,
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
      const tileCoords = this.latLonToTile(this.latitude, this.longitude, 15); // z = 17 (niveau de zoom)
      console.log("Coordonnées de la tuile :", tileCoords);

      // Préparer les données pour l'API
      const data = {
        id: this.generateUniqueId(),
        x: tileCoords.x,
        y: tileCoords.y,
        z: 15,
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
        this.imageTuile = await this.getCaptchaImageTuile(data.mode, data.z, data.x, data.y);
        this.isModalOpen = true;
      } catch (error) {
        console.error("Erreur :", error);
      }
    },
    async getCaptchaImageTuile(layer, tileMatrix, col, row) {
      try {
        const response = await fetch(`https://qlf-geocaptcha.ign.fr/api/v1/admin/proxy/tile?layer=${layer}&tileMatrix=${tileMatrix}&col=${col}&row=${row}`,
            {
              headers: {
                "Accept": "image/png",
                "x-api-key": import.meta.env.VITE_API_KEY,
                "x-app-id": import.meta.env.VITE_API_ID,
              }
            }
        );
        if (!response.ok) throw new Error('Image non trouvée');
        return URL.createObjectURL(await response.blob());
      }catch (error){
        console.log(error)
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

    showTooltip() {
      this.isTooltipVisible = true;
    },

    hideTooltip() {
      this.isTooltipVisible = false;
    },

    openModal() {
      this.isModalOpen = true;
      document.body.style.overflow = 'hidden';
    },

    closeModal() {
      this.isModalOpen = false;
      document.body.style.overflow = 'auto';
      this.isRefuse = true;
      setTimeout(() => {
        this.isRefuse = false;
      }, 3000);
    },

    openDepartement() {

      // Réinitialiser les champs
      this.latitude = "";
      this.longitude = "";
      this.zipcode = "";
      this.mode = "";

      this.latitudePlaceholder = "Entrez une latitude";
      this.longitudePlaceholder = "Entrez une longitude";
    },

    closeDepartement() {
      this.isDepartement = false;
      this.selectRandomDepartement();
    },

    selectRandomDepartement() {
      if (this.departements.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.departements.length);
        this.randomDepartement = this.departements[randomIndex];

        this.fetchDepartmentBoundary(this.randomDepartement.code).then(() => {
          // Générer des coordonnées aléatoires dans les limites du département
          if (this.latitudeMin !== null && this.latitudeMax !== null &&
              this.longitudeMin !== null && this.longitudeMax !== null) {

            // Générer latitude aléatoire avec un point comme séparateur décimal
            this.latitude = Number(this.getRandomInRange(this.latitudeMin, this.latitudeMax).toFixed(6).replace(',', '.'));

            // Générer longitude aléatoire avec un point comme séparateur décimal
            this.longitude = Number(this.getRandomInRange(this.longitudeMin, this.longitudeMax).toFixed(6).replace(',', '.'));


            // Définir le zipcode en fonction du code du département
            this.zipcode = this.generateRandomZipcode(this.randomDepartement.code);

            this.mode = Math.random() < 0.5 ? "ortho" : "scan";

          }
        });
      }
    },

    // Méthode utilitaire pour générer un nombre aléatoire dans un intervalle
    getRandomInRange(min, max) {
      return Math.random() * (max - min) + min;
    },

    generateRandomZipcode(departmentCode) {
      // Vérifier si c'est un département d'outre-mer (DOM-TOM)
      const domTomCodes = ['971', '972', '973', '974', '976'];

      if (domTomCodes.includes(departmentCode)) {
        // Pour les DOM-TOM, utiliser les 3 premiers chiffres du code département
        const prefix = departmentCode;
        // Générer 2 chiffres aléatoires
        const suffix = this.generateRandomNumbers(2);
        return `${prefix}${suffix}`;
      } else {
        // Pour les départements métropolitains, utiliser les 2 premiers chiffres du code département
        const prefix = departmentCode.padStart(2, '0');
        // Générer 3 chiffres aléatoires
        const suffix = this.generateRandomNumbers(3);
        return `${prefix}${suffix}`;
      }
    },

    // Méthode pour générer des nombres aléatoires
    generateRandomNumbers(length) {
      return Array.from(
        { length },
        () => Math.floor(Math.random() * 10)
      ).join('');
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

          return bounds; // Retourne les limites
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des limites du département :', error);
        throw error;
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
      this.isModalOpen = false;
      this.isSuccess = true;
      this.isDepartement = false;
      this.latitude = "";
      this.longitude = "";
      this.zipcode = "";
      this.mode = "";

      this.latitudePlaceholder = "Entrez une latitude";
      this.longitudePlaceholder = "Entrez une longitude";

      setTimeout(() => {
        this.isSuccess = false;
      }, 3000);
    }
  }
}
</script>


<style scoped>

.fr-h1 {
  margin-top: 170px;
  text-align: center;
}

.label_param{
  text-align: center;
  margin-bottom: 20px;
}

.choix-zone {
  margin-top: 20px;
  margin-bottom: -20px;
}

.lat-format {
  margin-top: 25px;
}

.mode-format {
  margin-top: 25px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}


.button-container {
  display: flex;
  align-items: center; /* Aligne les éléments verticalement */
  gap: 10px; /* Espacement entre le tooltip et le bouton */
}
.tooltip-container {
  position: relative;
}

.tooltip-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 5px;
}

.custom-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgb(21, 21, 21);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  white-space: nowrap;
  font-size: 14px;
  visibility: visible;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.tooltip-container:hover .custom-tooltip {
  visibility: visible;
  opacity: 1;
}

.btn-generer {
  display: block;
  margin-left: auto;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fond semi-transparent */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* S'assurer que la modale est au-dessus des autres éléments */
}

.image-container {
  display: flex;
  justify-content: center;
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

.accept-btn{
  outline: 2px solid rgb(0,0,145);
}

.accept-btn:hover{
  outline: 2px solid rgb(18,18,255);
}

.refuse-btn{
  color: rgb(225,0,15);
  outline: 2px solid rgb(225,0,15);
}

.refuse-btn{
  color: rgb(255,41,47);
  outline: 2px solid rgb(255,41,47);
}


.hidden {
  visibility: hidden;
  opacity: 0;
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