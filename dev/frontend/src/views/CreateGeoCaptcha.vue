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

                <!-- Zone du formulaire -->
                <label class="fr-label label_param" for="select-hint">
                  <span class="fr-h4">Paramètres de génération</span> 
                  <span class="fr-hint-text">En choisissant un mode, vous pourrez générer un GéoCaptcha en France métropolitaine et dans les DOM-TOM.</span>
                </label>
                <form @submit.prevent="validateAndCreateGeoCaptcha">
                  <div class="fr-input-group">

                    <!-- Choix parmis les 3 options : Sur la carte, Coordonnées précises et Aléatoire -->
                    <fieldset class="fr-segmented">
                      <div class="fr-segmented__elements">
                        <div class="fr-segmented__element">
                          <input value="1" v-model="selectedOption" @click="closeDepartement" type="radio" id="segmented-2073-3" name="segmented-2073">
                          <label class="fr-icon-road-map-line fr-label" for="segmented-2073-3">
                            Sur la carte
                          </label>
                        </div>
                        <div class="fr-segmented__element">
                          <input value="2" v-model="selectedOption" @click="openDepartement" type="radio" id="segmented-2073-2" name="segmented-2073">
                          <label class="fr-icon-map-pin-2-line fr-label" for="segmented-2073-2">
                            Coordonnées précises
                          </label>
                        </div>
                        <div class="fr-segmented__element">
                          <input value="3" v-model="selectedOption" @click="closeDepartement" type="radio" id="segmented-2073-1" name="segmented-2073">
                          <label class="fr-icon-question-line fr-label" for="segmented-2073-1">
                            Aléatoire
                          </label>
                        </div> 
                      </div>
                    </fieldset>
                    
                    <!-- Phrase en fonction de l'option choisi -->
                    <p v-if="selectedOption === '1'" class="choix-zone">Sélectionnez une zone où un GéoCaptcha sera généré. Cliquez une première fois pour initier la sélection, étendez la zone, puis cliquez à nouveau pour valider.</p>
                    <p v-if="selectedOption === '2'" class="choix-zone">Le GéoCaptcha sera généré dans le département de France que vous aurez choisi.</p>
                    <p v-if="selectedOption === '3'" class="choix-zone">Le GéoCaptcha sera généré avec une localisation aléatoire en France.</p>

                    <!-- Select pour la sélection du département pour les options Coordonnées précises et Aléatoire -->
                    <select v-if="selectedOption === '2' || selectedOption === '3'" id="departement" v-model="selectedDepartement" class="fr-select" :class="{ hidden: !isDepartement }" :required="isDepartement">
                      <option value="" disabled selected>Choisissez votre département</option>
                      <option v-for="dept in departements" :key="dept.code" :value="dept.code">
                        {{ dept.nom }} ({{ dept.code }})
                      </option>
                    </select>

                    <!-- Option Coordonnées précises -->
                    <div v-if="selectedOption === '2'">
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

                        <div class="fr-input-group">
                          <label class="fr-label" for="zipcode">Zipcode :</label>
                          <input type="text" id="zipcode" v-model="zipcode" class="fr-input" placeholder="Entrez un code postal" required />
                          <p v-if="zipcodeError" class="fr-error-text">{{ zipcodeError }}</p>
                        </div>
                      </div>
                    </div>           

                    <!-- Option Aléatoire -->
                    <div v-if="selectedOption === '3'">
                      <div class="fr-input-group">
                        <label class="fr-label" for="random-departement">Département aléatoire :</label>
                        <input type="text" id="random-departement" v-model="randomDepartement.nom" class="fr-input" readonly />
                      </div>

                      <div class="fr-input-group">
                        <label class="fr-label lat-format" for="latitude">Latitude :</label>
                        <input type="number" step="any" id="latitude" v-model="latitude" class="fr-input" :placeholder="latitudePlaceholder" readonly />
                      </div>

                      <div class="fr-input-group">
                        <label class="fr-label" for="longitude">Longitude :</label>
                        <input type="number" step="any" id="longitude" v-model="longitude" class="fr-input" :placeholder="longitudePlaceholder" readonly />
                      </div>

                      <div class="fr-input-group">
                        <label class="fr-label" for="zipcode">Zipcode :</label>
                        <input type="text" id="zipcode" v-model="zipcode" class="fr-input" readonly />
                      </div>
                    </div>

                    <!-- Option Sur la carte -->
                    <div v-if="selectedOption === '1'">
                      <div class="map-container">
                        
                        <!-- Carte -->
                        <div id="map" class="map"></div>
                        
                        <div class="row mt-3">
                          <div class="col-auto">
                            <span class="tag-group">
                              <input type="button" value="Annuler la sélection" class="fr-tag tag-undo" @click="undoDraw"/>
                            </span>
                          </div>
                        </div>
                      
                        <div v-if="boxCoordinates.length > 0" class="mt-3">
                          <div v-if="randomPoint">
                            <p><strong>Point aléatoire dans la boîte :</strong></p>

                            <div class="fr-input-group">
                              <label class="fr-label" for="latitude">Latitude :</label>
                              <input type="number" step="any" id="latitude" v-model="latitude" class="fr-input" :placeholder="latitudePlaceholder" readonly />
                            </div>

                            <div class="fr-input-group">
                              <label class="fr-label" for="longitude">Longitude :</label>
                              <input type="number" step="any" id="longitude" v-model="longitude" class="fr-input" :placeholder="longitudePlaceholder" readonly />
                            </div>

                            <div v-if="showAlert" id="alert-1070" class="fr-alert fr-alert--error">
                              <h3 class="fr-alert__title">Erreur</h3>
                              <p>Impossible de générer un GéoCaptcha en dehors de la France. Veuillez sélectionner une zone en France.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Choix du mode -->
                    <div class="fr-input-group mode-format">
                      <label class="fr-label" for="mode">Mode :</label>
                      <select id="mode" v-model="mode" class="fr-select" required>
                        <option value="" disabled selected>Choisissez un mode</option>
                        <option value="ortho">Ortho</option>
                        <option value="plan-sur-plan">Plan</option>
                        <option value="scan">Scan</option>
                      </select>
                    </div>

                    <!-- Bouton pour générer une tuile -->
                    <div class="button-container">
                      <div v-if="selectedOption === '3'" class="tooltip-container">
                        <label @click="closeDepartement" class="fr-icon-refresh-line"></label>
                      </div>
                      <button type="submit" class="fr-btn btn-generer">Générer</button>
                    </div>

                    <!-- Alerte d'acceptation de la tuile -->
                    <div v-if="isSuccess" id="alert-1068" class="fr-alert fr-alert--success">
                      <h3 class="fr-alert__title">Succès de la création</h3>
                      <p v-if="isDepartement">{{ successMessage }}</p>
                      <p v-else>GéoCaptcha créé avec une localisation en France.</p>
                    </div>

                    <!-- Alerte de refus de la tuile -->
                    <div v-if="isRefuse" id="alert-1068" class="fr-alert fr-alert--info">
                      <h3 class="fr-alert__title">Tuile refusée</h3>
                      <p v-if="isDepartement">{{ successMessage }}</p>
                      <p v-else>GéoCaptcha non enregistré.</p>
                    </div>
                  </div>
                  
                  <!-- Modale avec la tuile générée -->
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
                              <p>Voici un GéoCaptcha correspondant à la zone géographique choisie :</p>
                              <div class="image-container">
                                <!-- Conteneur pour l'image circulaire rotative -->
                                <div class="captchas" @pointerdown="down($event)" @pointerup="up" @mouseleave="up">
                                <div class="captcha-kingpin">
                                  <div class="layer layer-base">
                                    <img :src="backgroundImageTuile" alt="fond du geocaptcha" v-if="backgroundImageTuile">
                                  </div>
                                  <div class="layer layer-stacked" :style="{ transform: `rotate(-${rotationAngle}deg)` }">
                                    <div class="cropped">
                                      <img :src="imageTuile" alt="geocaptcha" v-if="imageTuile">
                                    </div>
                                    <div class="grab"></div>
                                  </div>
                                </div>
                                </div>
                                <p v-if="!imageTuile">Chargement de l'image...</p>
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

/*Bibliothèque OpenLayers*/
import "ol/ol.css";
import Map from "ol/Map.js";
import View from "ol/View.js";
import Draw, { createBox } from "ol/interaction/Draw.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";
import FullScreen from 'ol/control/FullScreen.js';
import {defaults as defaultControls} from 'ol/control/defaults.js';
import { fromLonLat, toLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector.js";
import {XYZ} from 'ol/source';

/*Bibliothèque Turf*/
import * as turf from "@turf/turf";

/*Service de logs*/
import { auditService } from '@/services/audit-service';

export default {
  name: "OpenLayersMap",
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
      map: null,
      draw: null,
      vectorLayer: null,
      source: null,
      selectedShape: "Box",
      boxCoordinates: [],
      randomPoint: null,
      showAlert: false,

      rotationAngle: Math.floor(Math.random() * 360),
      backgroundMode: "", // Pour stocker le mode de fond différent
      backgroundImageTuile: "",
      startAngle: 0,
      bboxCenter: {},
      captcha: null,
    };
  },

  watch: {
    selectedShape() {
      this.updateInteraction();
    },

    selectedDepartement(newValue) {
      if (newValue) {
        this.fetchDepartmentBoundary(newValue);
      }
    },
  },

  async mounted() {
    window.scrollTo(0, 0);
    this.rotationAngle = Math.floor(Math.random() * 360);
    this.recupDepartementFrance();
    this.$nextTick(() => {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        this.initializeMap();
      } else {
        // Observez les changements de l'option sélectionnée
        this.$watch('selectedOption', (newValue) => {
          if (newValue === '1') {
            this.$nextTick(() => {
              const mapContainer = document.getElementById('map');
              if (mapContainer) {
                this.initializeMap();
              }
            });
          }
        });
      }
    });
    await this.loadGeoJson();
  },

  methods: {
    async validateAndCreateGeoCaptcha() {
      this.latitudeError = "";
      this.longitudeError = "";
      this.zipcodeError = "";
      this.modeError = "";

      // Cas "Sur la carte"
      if (this.selectedOption === '1') {
        if (!this.randomPoint) {
          alert("Veuillez dessiner une boîte et générer un point aléatoire sur la carte.");
          return;
        }
        this.latitude = this.randomPoint[1];
        this.longitude = this.randomPoint[0];
      }

      // Vérifications pour toutes les options
      if (!this.latitude || !this.longitude || !this.zipcode || !this.mode) {
        if (!this.latitude) this.latitudeError = "La latitude est obligatoire.";
        if (!this.longitude) this.longitudeError = "La longitude est obligatoire.";
        if (!this.zipcode) this.zipcodeError = "Le zipcode est obligatoire.";
        if (!this.mode) this.modeError = "Le mode est obligatoire.";
        return;
      }

      // Conversion des valeurs en nombres décimaux
      const lat = parseFloat(this.latitude);
      const lon = parseFloat(this.longitude);

      // Vérification que les valeurs soient des nombres valides
      if (isNaN(lat)) {
        this.latitudeError = "La latitude doit être un nombre valide.";
        return;
      }
      if (isNaN(lon)) {
        this.longitudeError = "La longitude doit être un nombre valide.";
        return;
      }

      // Vérification de la longueur du code postal
      if (this.zipcode.length !== 5) {
        this.zipcodeError = "Le code postal doit comporter exactement 5 chiffres.";
        return;
      }

      // Pour les options "Coordonnées précises" et "Aléatoire", gardez les vérifications de limites
      if (this.selectedOption === '2') {
        if (lat < this.latitudeMin || lat > this.latitudeMax) {
          this.latitudeError = `La latitude doit être entre ${this.latitudeMin} et ${this.latitudeMax}.`;
          return;
        }

        if (lon < this.longitudeMin || lon > this.longitudeMax) {
          this.longitudeError = `La longitude doit être entre ${this.longitudeMin} et ${this.longitudeMax}.`;
          return;
        }

        const departmentCode = this.selectedDepartement;
        let expectedPrefix;

        // Gestion des cas spéciaux : la Corse et les DOM-TOM
        if (departmentCode === '2A' || departmentCode === '2B') {
          expectedPrefix = '20';
        } else if (['971', '972', '973', '974', '976'].includes(departmentCode)) {
          expectedPrefix = departmentCode + '00';
        } else {
          expectedPrefix = departmentCode.padStart(2, '0');
        }

        if (!this.zipcode.startsWith(expectedPrefix)) {
          this.zipcodeError = `Le code postal doit commencer par ${expectedPrefix}.`;
          return;
        }
      }

      // Affichage de la tuile du GéoCaptcha
      this.showGeoCaptchaTile();
    },

    async showGeoCaptchaTile() {

      // Conversion des coordonnées latitude/longitude en coordonnées de tuile
      const tileCoords = this.latLonToTile(this.latitude, this.longitude, 15);
      console.log("Coordonnées de la tuile :", tileCoords);

      this.rotationAngle = Math.floor(Math.random() * 360);

      // Préparation des données pour l'API
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

      // Cas où le mode est 'plan-sur-plan' -- le changer en 'plan' pour faire fonctionner le mode
      let actualMode = data.mode;
      if (data.mode === 'plan-sur-plan') {
        actualMode = 'plan';
      }

      try {
        // Récupérer l'image principale
        this.imageTuile = await this.getCaptchaImageTuile(actualMode, data.z, data.x, data.y);
        
        // Utiliser exactement la même image pour l'arrière-plan mais avec plan comme mode
        this.backgroundImageTuile = await this.getCaptchaImageTuile("plan", data.z, data.x, data.y);
        
        this.isModalOpen = true;
      } catch (error) {
        console.error("Erreur :", error);
      }
    },

    down(evt) {
      this.captcha = evt.currentTarget;
      let bbox = this.captcha.getBoundingClientRect();
      this.bboxCenter = {
        x: bbox.left + bbox.width / 2,
        y: bbox.top + bbox.height / 2,
      };
      this.startAngle = (this.getAngle(evt) - this.rotationAngle + 720) % 360;
      this.captcha._evt = this.move.bind(this);
      this.captcha.addEventListener('pointermove', this.captcha._evt);
    },
    
    up() {
      if (this.captcha) {
        this.captcha.removeEventListener('pointermove', this.captcha._evt);
      }
    },
    
    move(evt) {
      this.rotationAngle = (this.getAngle(evt) - this.startAngle + 720) % 360;
    },
    
    getAngle(evt) {
      return -(
        (Math.atan2(this.bboxCenter.y - evt.clientY, this.bboxCenter.x - evt.clientX) *
          180) /
        Math.PI
      );
    },


    async createGeoCaptcha() {
      // Conversion des coordonnées latitude/longitude en coordonnées de tuile
      const tileCoords = this.latLonToTile(this.latitude, this.longitude, 15); // z = 15 pour les GéoCaptchas
      console.log("Coordonnées de la tuile :", tileCoords);

      // Préparation des données pour l'API
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
        // Envoie de la requête POST à l'API pour récupérer le kingpin
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

        // Log de création d'un GéoCaptcha
        auditService.logCreate('/geo-captcha', `Création d'un GéoCaptcha`);

        const result = await response.json();
        console.log("Réponse de l'API :", result);

        if (data.mode === 'plan-sur-plan') {
          data.mode = 'plan';
        }

        this.successMessage = `GéoCaptcha créé avec succès ! ID : ${data.id}`;
        this.imageTuile = await this.getCaptchaImageTuile(data.mode, data.z, data.x, data.y);
        this.isModalOpen = true;
      } catch (error) {
        console.error("Erreur :", error);
        auditService.logError('/geo-captcha', `Échec lors de la création d'un GéoCaptcha`);
      }
    },

    async getCaptchaImageTuile(layer, tileMatrix, col, row) {
      // Récupération de l'image de la tuile à partir de l'API 
      try {
        const response = await fetch(`https://qlf-geocaptcha.ign.fr/api/v1/admin/proxy/tile?layer=${layer}&tileMatrix=${tileMatrix}&col=${col}&row=${row}`,
          {
            method: "GET",
            headers: {
              "Accept": "image/png",
              "x-api-key": import.meta.env.VITE_API_KEY,
              "x-app-id": import.meta.env.VITE_API_ID,
            }
          }
        );
        if (!response.ok) throw new Error('Image non trouvée');
        return URL.createObjectURL(await response.blob());
      } catch (error) {
        console.log(error)
      }
    },

    // Fonction de conversion des coordonnées latitude/longitude en coordonnées de tuile
    latLonToTile(lat, lon, z) {
      const x = Math.floor((lon + 180) / 360 * Math.pow(2, z));
      const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));
      console.log(x, y);
      return { x, y };
    },

    // Fonction de génération d'un ID unique
    generateUniqueId() {
      return Math.floor(Math.random() * 100000).toString();
    },

    // Fonction qui récupère la liste des départements de France à partir de l'API du site geo.api.gouv.fr
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

    closeModal() {
      this.isModalOpen = false;
      document.body.style.overflow = 'auto';
      this.isRefuse = true;
      setTimeout(() => {
        this.isRefuse = false;
      }, 3000);
    },

    openDepartement() {
      // Réinitialisation des champs 
      this.latitude = "";
      this.longitude = "";
      this.zipcode = "";
      this.mode = "";

      // Réinitialisation des Palceholders
      this.latitudePlaceholder = "Entrez une latitude";
      this.longitudePlaceholder = "Entrez une longitude";
    },

    closeDepartement() {
      // Réinitialisation de la carte  
      this.$nextTick(() => {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
          this.initializeMap();
        } else {
          // Observez les changements de l'option sélectionnée
          this.$watch('selectedOption', (newValue) => {
            if (newValue === '1') {
              this.$nextTick(() => {
                const mapContainer = document.getElementById('map');
                if (mapContainer) {
                  this.initializeMap();
                }
              });
            }
          });
        }
      });

      this.isDepartement = false;
      this.selectRandomDepartement();
    },

    // Fonction donnant des valeurs aléatoires aux paramètres 
    selectRandomDepartement() {
      if (this.departements.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.departements.length);
        this.randomDepartement = this.departements[randomIndex];
        
        this.fetchDepartmentBoundary(this.randomDepartement.code).then(() => {
          // Génération de coordonnées aléatoires dans les limites du département
          if (this.latitudeMin !== null && this.latitudeMax !== null && 
              this.longitudeMin !== null && this.longitudeMax !== null) {
            
            // Génération d'une latitude aléatoire
            this.latitude = Number(this.getRandomInRange(this.latitudeMin, this.latitudeMax).toFixed(6).replace(',', '.'));

            // Génération d'une longitude aléatoire
            this.longitude = Number(this.getRandomInRange(this.longitudeMin, this.longitudeMax).toFixed(6).replace(',', '.'));

            // Définir un zipcode en fonction du code du département
            this.zipcode = this.generateRandomZipcode(this.randomDepartement.code);

            // Choix d'un mode aléatoire parmi "ortho", "scan" et "plan"
            const modes = ["ortho", "scan", "plan-sur-plan"];
            this.mode = modes[Math.floor(Math.random() * modes.length)];
          }
        });
      }
    },

    // Méthode utilitaire pour générer un nombre aléatoire dans un intervalle
    getRandomInRange(min, max) {
      return Math.random() * (max - min) + min;
    },

    generateRandomZipcode(departmentCode) {
      // Lite des codes des départements d'outre-mer (DOM-TOM)
      const domTomCodes = ['971', '972', '973', '974', '976'];

      if (domTomCodes.includes(departmentCode)) {
        // Pour les DOM-TOM, utilisation des 3 premiers chiffres du code département
        const prefix = departmentCode;

        // Génération de 2 chiffres aléatoires
        const suffix = this.generateRandomNumbers(2);
        return `${prefix}${suffix}`;
      } else if (departmentCode === '2A' || departmentCode === '2B') {
        // Pour la Corse (2A et 2B), utiliser le préfixe '20'
        const prefix = '20';

        // Génération de 3 chiffres aléatoires
        const suffix = this.generateRandomNumbers(3);
        return `${prefix}${suffix}`;
      } else {
        // Pour les autres départements, utiliser les 2 premiers chiffres du code département
        const prefix = departmentCode.padStart(2, '0');

        // Génération 3 chiffres aléatoires
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

    // Fonction qui gère la récupération des limites des départements via l'API geo.api.gouv.fr
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
          
          return bounds;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des limites du département :', error);
        throw error;
      }
    },

    // Fonction qui calcule les limites des départements
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

    async handleConserver() {
      // Préparation des données pour l'API
      const tileCoords = this.latLonToTile(this.latitude, this.longitude, 15);
      const data = {
        id: this.generateUniqueId(),
        x: tileCoords.x,
        y: tileCoords.y,
        z: 15,
        zipcode: this.zipcode,
        mode: this.mode,
        ok: "1"
      };

      try {
        // Envoie de la requête POST à l'API pour récupérer le kingpin
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

        // Log de création d'un GéoCaptcha
        auditService.logCreate('/geo-captcha', `Création d'un GéoCaptcha`);

        const result = await response.json();
        console.log("Réponse de l'API :", result);

        this.successMessage = `GéoCaptcha créé avec succès ! ID : ${data.id}`;
        this.isSuccess = true;
        this.isModalOpen = false;

        setTimeout(() => {
          this.isSuccess = false;
        }, 3000);
      } catch (error) {
        console.error("Erreur :", error);
        auditService.logError('/geo-captcha', `Échec lors de la création d'un GéoCaptcha`);
      }
    },

    // Fonction d'initialisation de la carte pour 'Sur la carte'
    initializeMap() {
      this.source = new VectorSource({ wrapX: false });
      
      // Récupération du plan IGN
      const planIGN = new TileLayer({
        source: new XYZ({
          url: 'https://data.geopf.fr/wmts?' +
              'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&TILEMATRIXSET=PM' +
              '&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png' +
              '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}',
          attributions: 'Carte © IGN/Geoplateforme'
        }),
      });
      
      this.vectorLayer = new VectorLayer({
        source: this.source
      });
      
      this.map = new Map({
        controls: defaultControls().extend([new FullScreen()]),
        layers: [planIGN, this.vectorLayer],
        target: "map",
        view: new View({
          center: fromLonLat([2.45407, 46.80335]),
          zoom: 5,
          maxZoom: 15
        })
      });
      
      this.addInteraction();
    },

      // Fonction d'ajout de l'interaction de dessin
      addInteraction() {
        if (this.selectedShape === "None") return;

        let geometryFunction = this.selectedShape === "Box" ? createBox() : null;

        this.draw = new Draw({
          source: this.source,
          type: this.selectedShape === "Box" ? "Circle" : this.selectedShape,
          geometryFunction: geometryFunction,
        });

        // Suppression l'ancienne boîte avant de pouvoir en dessiner une nouvelle
        this.draw.on("drawstart", () => {
          this.clearAllDrawings();
        });

        // Événement déclenché après avoir dessiné la boîte
        this.draw.on("drawend", (event) => {
          const feature = event.feature;

          // Récupération des coordonnées des 4 coins de la boîte
          const coords = feature.getGeometry().getCoordinates()[0].map((coord) =>
            toLonLat(coord)
          );

          this.boxCoordinates = coords;
          this.randomPoint = this.getRandomPointInBox(coords);
        });

        this.map.addInteraction(this.draw);
      },

      updateInteraction() {
        if (this.draw) {
          this.map.removeInteraction(this.draw);
        }
        this.addInteraction();
      },

      // Fonction permettant d'annuler la sélection
      undoDraw() {
        const features = this.vectorLayer.getSource().getFeatures();
        if (features.length > 0) {
          this.vectorLayer.getSource().removeFeature(features[features.length - 1]);
          this.boxCoordinates = [];
          this.randomPoint = null;
          this.latitude = "";
          this.longitude = "";
          this.zipcode = "";
        }
      },

      // Fonction permettant de supprimer tous les dessins et réinitialiser les coordonnées
      clearAllDrawings() {
        console.log("Effacement de tous les dessins");
        this.vectorLayer.getSource().clear();
        this.boxCoordinates = [];
        this.randomPoint = null;
      },

      // Fonction permettant de récupérer le fichier geojson contenant les régions de France avec les outre-mers
      async loadGeoJson() {
        try {
          const response = await fetch("/regions-avec-outre-mer.geojson"); 
          this.franceGeoJson = await response.json();
        } catch (error) {
          console.error("Erreur de chargement du GeoJSON :", error);
        }
      },

    // Fonction vérifiant si un point se trouve à l'intérieur de la France
    isPointInFrance(lon, lat) {
      if (!this.franceGeoJson) return false;

      const point = turf.point([lon, lat]);
      return this.franceGeoJson.features.some((feature) =>
        turf.booleanPointInPolygon(point, feature)
      );
    },

    // Fonction générant un point aléatoire à l'intérieur de la boîte
    getRandomPointInBox(coords) {
      if (coords.length < 4 || !this.franceGeoJson) return null;

      const lons = coords.map((c) => c[0]);
      const lats = coords.map((c) => c[1]);

      const minLon = Math.min(...lons);
      const maxLon = Math.max(...lons);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);

      let randomLon, randomLat;
      let tries = 0, maxTries = 100;

      do {
        randomLon = Number(this.getRandomInRange(minLon, maxLon).toFixed(6).replace(',', '.'));
        randomLat = Number(this.getRandomInRange(minLat, maxLat).toFixed(6).replace(',', '.'));
        tries++;
      } while (!this.isPointInFrance(randomLon, randomLat) && tries < maxTries);

      // Vérification de si on a trouvé un point valide
      const validPoint = this.isPointInFrance(randomLon, randomLat);

      if (!validPoint) {
        alert("❌ Impossible de générer un GéoCaptcha en dehors de la France. Veuillez sélectionner une zone en France.");
        this.showAlert = true; 
        setTimeout(() => {
            this.showAlert = false;
        }, 3000);
        this.latitude = '';  
        this.longitude = '';
        this.zipcode = ''; 
        clearAllDrawings()
        return null;
      }

      // Mise à jour des coordonnées si le point est valide
      this.latitude = randomLat;
      this.longitude = randomLon;
        
        
      // Génération d'un zipcode basé sur la localisation
      const departementCode = this.findDepartementByCoordinates(this.longitude, this.latitude);
      if (departementCode) {
        this.zipcode = this.generateRandomZipcode(departementCode);
        // Génération d'un mode aléatoire parmi "ortho", "scan" et "plan"
        const modes = ["ortho", "scan", "plan-sur-plan"];
        this.mode = modes[Math.floor(Math.random() * modes.length)];

      }
        
      return [this.longitude, this.latitude];
    },

    // Fonction trouvant le code du département à partir des coordonnées
    findDepartementByCoordinates(lon, lat) {
      if (!this.franceGeoJson) return null;

      const point = turf.point([lon, lat]);
      for (let feature of this.franceGeoJson.features) {
        if (turf.booleanPointInPolygon(point, feature)) {
        return feature.properties.code;
        }
      }

      return null;
    },
  },
};
</script>






<style scoped>


/* Styles pour la carte OpenLayers */
.map {
  width: 100%;
  height: 300px;
  z-index: 1000;
  margin-top: 40px;
  border-radius: 20px; 
  overflow: hidden; 
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); 
}

.map:-webkit-full-screen {
  height: 100%;
  margin: 0;
}

.map:fullscreen {
  height: 100%;
}



/* Styles pour le formulaire */

.row {
  margin-top: 20px;
}

.fr-h1 {
  margin-top: 170px; 
  text-align: center;
}

.label_param {
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

.tag-undo{
  margin-left: auto !important;
}

.button-container {
  display: flex;
  align-items: center; 
  gap: 10px; 
}

.tag-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 10px;
}

.btn-generer {
  display: block;
  margin-left: auto;
} 


/* Styles pour le modal */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; 
}

.fr-modal__title {
  margin-bottom: 1em;
  text-align: center;
}

.fr-modal__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.accept-btn{
  outline: 2px solid rgb(0,0,145);
}

.accept-btn:hover{
  outline: 2px solid rgb(18,18,255);
}

.refuse-btn {
  color: red;
  outline: 2px solid red;
}

.hidden {
  visibility: hidden;
  opacity: 0;
}

.fr-error-text {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.fr-icon-refresh-line:hover {
  color: rgb(0,0,145);
  cursor: pointer;  
}

#alert-1068 {
  margin-top:1em;
}

/* Styles pour le défi géocaptcha */

.image-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 256px;
  height: 225px;
}

.captchas {
  width: 256px;
  height:200px;
  margin: 50px auto;
  box-shadow:0 0 0 1px;
  background:#d3d3d3;
  user-select: none;
}

.captcha-kingpin {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.layer-base {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.layer-base img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.layer-stacked .cropped img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.captcha-kingpin .cropped img {
  position: absolute;
  width: 256px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  object-fit: none; 
}

.captcha-kingpin .layer-base img {
  width: 256px;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.captcha-kingpin .layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background-position: 50% 50%;
}

.captcha-kingpin .layer-stacked {
  cursor: grab;
  position: absolute;
  width: 150px;
  height: 150px;
  top: 25px;
  left: 0;
  right: 0;
  margin: auto;
}

.captcha-kingpin .cropped {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 1px 3px, 0 0 0 15px rgba(36,60,71,.25);
}

.captcha-kingpin .grab {
  cursor: grab;
  position: absolute;
  z-index: 1;
  right: -10px;
  top: 60px;
  width: 20px;
  height: 30px;
  border-radius: 3px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 30'%3E%3Cpath d='m5,10h10M5,15h10M5,20h10' stroke='white' stroke-width='2'/%3E%3C/svg%3E");
  background-color: #243c47;
}

.captcha-kingpin .grab:hover {
  background-color: #30a7df;
}

</style>
