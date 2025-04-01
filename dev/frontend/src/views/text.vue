<template>
  <div class="dashboard">
    <div class="fr-tabs">
      <!-- Liste des onglets -->
      <ul class="fr-tabs__list" role="tablist" aria-label="Navigation des onglets">
        <!-- Onglet pour la gestion de GéoCaptcha -->
        <li role="presentation">
          <button
            id="tabpanel-404"
            class="fr-tabs__tab fr-icon-slideshow-line fr-tabs__tab--icon-left"
            :class="{ 'fr-tabs__tab--selected': activeTab === 'tabpanel-404' }"
            role="tab"
            :aria-selected="activeTab === 'tabpanel-404'"
            aria-controls="tabpanel-404-panel"
            @click="switchTab('tabpanel-404')"
          >
            Gestion de GéoCaptcha
          </button>
        </li>
        <!-- Onglet pour les logs -->
        <li role="presentation">
          <button
            id="tabpanel-405"
            class="fr-tabs__tab fr-icon-survey-line fr-tabs__tab--icon-left"
            :class="{ 'fr-tabs__tab--selected': activeTab === 'tabpanel-405' }"
            role="tab"
            :aria-selected="activeTab === 'tabpanel-405'"
            aria-controls="tabpanel-405-panel"
            @click="switchTab('tabpanel-405')"
          >
            Logs
          </button>
        </li>
      </ul>

      <!-- Contenus des onglets -->

      <!-- Contenu de l'onglet Gestion de GéoCaptcha -->
      <div
        id="tabpanel-404-panel"
        class="fr-tabs__panel tab-404"
        :class="{ 'fr-tabs__panel--selected': activeTab === 'tabpanel-404' }"
        role="tabpanel"
        aria-labelledby="tabpanel-404"
      >
        <div class="metrics-list">
          <div class="list-header">
            <h1 class="fr-h1">Gestion de Géocaptcha</h1>
            <h6 class="fr-h6">Heatmap affichant la localisation des GéoCaptchas créés :</h6>
            <!-- Composant Heatmap pour afficher les données -->
            <Heatmap :geocaptchaData="kingpinStats" />

            <!-- Barre de recherche et filtres -->
            <div class="select-group-metrics">
              <div class="fr-search-bar">
                <input
                  class="fr-input"
                  placeholder="Rechercher"
                  type="search"
                  v-model="searchQuery"
                />
                <button title="Rechercher" type="button" class="fr-btn">Rechercher</button>
              </div>
              <!-- Filtres par tag -->
              <div class="filter-tags">
                <ul class="fr-tags-group">
                  <li>
                    <button
                      class="fr-tag"
                      :class="{ 'fr-tag--selected': selectedTag === 'all', 'fr-tag--checked': selectedTag === 'all' }"
                      :aria-pressed="selectedTag === 'all'"
                      @click="setFilter('all')"
                    >
                      Tous
                    </button>
                  </li>
                  <li>
                    <button
                      class="fr-tag"
                      :class="{ 'fr-tag--selected': selectedTag === 'success', 'fr-tag--checked': selectedTag === 'success' }"
                      :aria-pressed="selectedTag === 'success'"
                      @click="setFilter('success')"
                    >
                      Réussis
                    </button>
                  </li>
                  <li>
                    <button
                      class="fr-tag"
                      :class="{ 'fr-tag--selected': selectedTag === 'failed', 'fr-tag--checked': selectedTag === 'failed' }"
                      :aria-pressed="selectedTag === 'failed'"
                      @click="setFilter('failed')"
                    >
                      Échoués
                    </button>
                  </li>
                </ul>
              </div>

              <!-- Options de tri -->
              <div class="trier-metrics">
                <label class="fr-label" for="filter-select">
                  <span class="fr-icon-filter-line fr-icon--sm" aria-hidden="true"></span>
                  <span class="trier-text">Trier</span>
                </label>
                <select
                  class="fr-select select-metrics"
                  aria-describedby="select-messages"
                  id="filter-select"
                  v-model="sortKey"
                  @change="sortOrder = 'desc'"
                >
                  <option value="name">Nom</option>
                  <option value="successRate">Taux de réussite</option>
                  <option value="attempts">Nombre d'essais</option>
                </select>
                <button class="fr-icon-arrow-up-down-line" @click="toggleSortOrder"></button>
              </div>
            </div>
          </div>
        </div>

        <!-- Affichage des statistiques filtrées et triées -->
        <div class="fr-grid-row fr-grid-row--gutters">
          <div
            v-for="(kingpin, index) in filteredAndSortedStats"
            :key="index"
            class="fr-col-12 fr-col-md-6 fr-col-lg-4"
          >
            <div class="fr-tile" @click="openKingpinModal(kingpin)">
              <div class="fr-tile__header">
                <p><strong class="fr-tile__title">Nom: </strong> {{ kingpin.name }}</p>
              </div>
              <div class="fr-tile__body">
                <div class="geocaptcha-icon bg-gray-100 rounded-full p-2 flex items-center justify-center mb-4">
                  <span class="text-2xl">🧩</span> <!-- À modifier à terme -->
                </div>
                <div class="infos">
                  <div class="info-item grid grid-cols-2 gap-4 mb-4">
                    <div class="text-center">
                      <p><strong>Nombre d'essais : </strong>{{ kingpin.attempts }}</p>
                    </div>
                  </div>
                  <div class="info-item gauge mb-2">
                    <!-- Composant GaugeChart pour afficher le taux de réussite -->
                    <GaugeChart :value="Math.round(kingpin.successRate)" min="0" max="100" label="Taux de réussite (%)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal pour les détails du Géocaptcha -->
        <div v-if="isModalVisible" class="modal-overlay">
          <div class="fr-container fr-container--fluid fr-container-md">
            <div class="fr-grid-row fr-grid-row--center">
              <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
                <div class="fr-modal__body">
                  <div class="fr-modal__header">
                    <button @click="closeModal" class="fr-btn--close fr-btn">Fermer</button>
                  </div>
                  <div class="fr-modal__content">
                    <h2 id="modal-6053-title" class="fr-modal__title">
                      <span class="fr-icon-arrow-right-line fr-icon--lg" aria-hidden="true"></span>
                      Détails du Géocaptcha
                    </h2>
                    <div>
                      <p><strong>ID:</strong> {{ selectedGeocaptcha.id }}</p>
                      <p><strong>IP:</strong> {{ selectedGeocaptcha.ip }}</p>
                      <p><strong>Essais:</strong> {{ selectedGeocaptcha.attempts }}</p>
                      <p><strong>Réussites:</strong> {{ selectedGeocaptcha.successes }}</p>
                      <p><strong>Echecs:</strong> {{ selectedGeocaptcha.failures }}</p>
                      <p><strong>Précision:</strong> {{ selectedGeocaptcha.accuracy }}%</p>
                      <p><strong>Referer:</strong> {{ selectedGeocaptcha.referer }}</p>
                      <p><strong>Date de création:</strong> {{ selectedGeocaptcha.createdAt }}</p>
                    </div>
                  </div>
                  <div class="fr-modal__footer">
                    <div class="fr-btns-group fr-btns-group--center fr-btns-group--inline-lg fr-btns-group--icon-left">
                      <button @click="showConfirmationModal" class="fr-btn fr-btn--reject">Rejeter</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal de confirmation pour rejeter un Géocaptcha -->
        <div v-if="isConfirmationModalVisible" class="modal-overlay">
          <div class="fr-container fr-container--fluid fr-container-md">
            <div class="fr-grid-row fr-grid-row--center">
              <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
                <div class="fr-modal__body">
                  <div class="fr-modal__header">
                    <button @click="closeConfirmationModal" class="fr-btn--close fr-btn">Fermer</button>
                  </div>
                  <div class="fr-modal__content">
                    <h2 id="modal-6053-title" class="fr-modal__title">
                      <span class="fr-icon-warning-line fr-icon--lg" aria-hidden="true"></span>
                      Confirmation
                    </h2>
                    <p>Êtes-vous sûr de vouloir rejeter ce géocaptcha ?</p>
                  </div>
                  <div class="fr-modal__footer fr-btns-group--right fr-btns-group--inline-lg fr-btns-group--icon-left">
                    <button @click="rejectGeocaptcha" class="fr-btn fr-btn--reject">Oui, Rejeter</button>
                    <button @click="closeConfirmationModal" class="fr-btn fr-btn--cancel">Annuler</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu de l'onglet Logs -->
      <div
        id="tabpanel-405-panel"
        class="fr-tabs__panel tab-405"
        :class="{ 'fr-tabs__panel--selected': activeTab === 'tabpanel-405' }"
        role="tabpanel"
        aria-labelledby="tabpanel-405"
      >
        <h1>Logs</h1>
        <div class="audit-container">
          <div class="fr-container">
            <div class="fr-input-group">
              <div class="filtre">
                <!-- Filtre par route -->
                <select id="filter-route" v-model="filterRoute" class="fr-select filtre-route">
                  <option value="">Filtre par route</option>
                  <option v-for="route in uniqueRoutes" :key="route" :value="route">{{ route }}</option>
                </select>
                <button class="fr-btn-tertiary-no-outline fr-icon-refresh-line btn-refresh" @click="clearFilters"></button>
              </div>
              <!-- Bouton pour effacer tous les logs -->
              <button class="fr-btn fr-btn--danger delete-log" @click="confirmDeleteLogs" :disabled="logs.length === 0">Tout effacer</button>
            </div>
          </div>

          <!-- Message si aucun log ne correspond aux filtres -->
          <div v-if="filteredLogs.length === 0" class="fr-container">
            <div class="box-audit box-info">
              <span class="action-audit action-info">INFO</span>
              <span class="description-audit">Aucune entrée d'audit ne correspond aux filtres.</span>
            </div>
          </div>

          <!-- Affichage des logs filtrés -->
          <div v-for="(log, index) in filteredLogs" :key="index" class="fr-container">
            <div :class="['box-audit', getBoxClass(log.action)]">
              <span :class="['action-audit', getActionClass(log.action)]">{{ log.action }}</span>
              <span class="route-audit">{{ log.route }}</span>
              <span class="description-audit">{{ log.description }}</span>
              <span class="time-audit">{{ log.timestamp }}</span>
            </div>
          </div>

          <!-- Pagination des logs -->
          <div class="fr-pagination" v-if="filteredLogs.length > 0">
            <button
              class="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-left-s-line"
              :disabled="currentPage === 1"
              @click="currentPage--"
            ></button>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button
              class="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-right-s-line"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            ></button>
          </div>
        </div>

        <!-- Modal de confirmation pour supprimer tous les logs -->
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
              <p>Voici un GéoCaptcha correspondant à la zone géographique choisie: </p>
              
              <div class="preview-container">
                <div class="map-preview" id="preview-map"></div>
                <div class="circular-overlay" 
                     :style="{ transform: `rotate(${rotationDegrees}deg)` }">
                  <img :src="imageTuile" alt="geocaptcha" v-if="imageTuile" class="circular-image">
                </div>
                <div class="rotation-controls">
                  <button @click="rotateLeft" class="fr-btn fr-btn--sm fr-icon-arrow-left-line"></button>
                  <span>{{ rotationDegrees }}°</span>
                  <button @click="rotateRight" class="fr-btn fr-btn--sm fr-icon-arrow-right-line"></button>
                </div>
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
      </div>
    </div>
  </div>
</template>

<script>
// Ajout des imports nécessaires pour la carte de prévisualisation
import "ol/ol.css";
import Map from "ol/Map.js";
import View from "ol/View.js";
import {XYZ} from 'ol/source';

import Draw, { createBox } from "ol/interaction/Draw.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";
import FullScreen from 'ol/control/FullScreen.js';
import {defaults as defaultControls} from 'ol/control/defaults.js';
import { fromLonLat, toLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector.js";


/*Bibliothèque Turf*/
import * as turf from "@turf/turf";

/*Service de logs*/
import { auditService } from '@/services/audit-service';


export default {
  name: "OpenLayersMap",
  data() {
    return {
      // Ajout de nouvelles propriétés
      previewMap: null,
      rotationDegrees: 0,
      
      // Propriétés existantes...
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
    // Nouvelles méthodes pour la rotation et la carte de prévisualisation
    rotateLeft() {
      this.rotationDegrees = (this.rotationDegrees - 15) % 360;
    },
    
    rotateRight() {
      this.rotationDegrees = (this.rotationDegrees + 15) % 360;
    },
    
    initializePreviewMap() {
      // Attendre que le DOM soit prêt
      this.$nextTick(() => {
        const previewMapElement = document.getElementById('preview-map');
        if (!previewMapElement) return;
        
        // Récupération du plan IGN comme fond de carte
        const planIGN = new TileLayer({
          source: new XYZ({
            url: 'https://data.geopf.fr/wmts?' +
                'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&TILEMATRIXSET=PM' +
                '&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png' +
                '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}',
            attributions: 'Carte © IGN/Geoplateforme'
          }),
        });
        
        // Créer la carte de prévisualisation
        this.previewMap = new Map({
          layers: [planIGN],
          target: 'preview-map',
          view: new View({
            center: fromLonLat([this.longitude, this.latitude]),
            zoom: 15
          })
        });
      });
    },
    
    // Modification de la méthode showGeoCaptchaTile pour initialiser la carte de prévisualisation
    async showGeoCaptchaTile() {
      // Code existant
      const tileCoords = this.latLonToTile(this.latitude, this.longitude, 15);
      console.log("Coordonnées de la tuile :", tileCoords);

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
      if (data.mode === 'plan-sur-plan') {
        data.mode = 'plan';
      }

      try {
        this.imageTuile = await this.getCaptchaImageTuile(data.mode, data.z, data.x, data.y);
        this.isModalOpen = true;
        
        // Réinitialiser la rotation
        this.rotationDegrees = 0;
        
        // Initialiser la carte de prévisualisation
        this.initializePreviewMap();
      } catch (error) {
        console.error("Erreur :", error);
      }
    },
    
    // Mettre à jour la position du modal pour éviter les problèmes de scrolling
    closeModal() {
      this.isModalOpen = false;
      document.body.style.overflow = 'auto';
      this.isRefuse = true;
      
      // Nettoyer la carte de prévisualisation
      if (this.previewMap) {
        this.previewMap.setTarget(null);
        this.previewMap = null;
      }
      
      setTimeout(() => {
        this.isRefuse = false;
      }, 3000);
    },

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


async getCaptchaImageTuile(foregroundLayer, tileMatrix, col, row) {
  try {
    // Récupération de l'image de la tuile de fond en mode 'plan'
    const backgroundResponse = await fetch(`https://qlf-geocaptcha.ign.fr/api/v1/admin/proxy/tile?layer=plan&tileMatrix=${tileMatrix}&col=${col}&row=${row}`, {
      method: "GET",
      headers: {
        "Accept": "image/png",
        "x-api-key": import.meta.env.VITE_API_KEY,
        "x-app-id": import.meta.env.VITE_API_ID,
      }
    });

    if (!backgroundResponse.ok) throw new Error('Image de fond non trouvée');

    const backgroundBlob = await backgroundResponse.blob();
    const backgroundUrl = URL.createObjectURL(backgroundBlob);

    // Récupération de l'image de la tuile de premier plan avec le mode sélectionné
    const foregroundResponse = await fetch(`https://qlf-geocaptcha.ign.fr/api/v1/admin/proxy/tile?layer=${foregroundLayer}&tileMatrix=${tileMatrix}&col=${col}&row=${row}`, {
      method: "GET",
      headers: {
        "Accept": "image/png",
        "x-api-key": import.meta.env.VITE_API_KEY,
        "x-app-id": import.meta.env.VITE_API_ID,
      }
    });

    if (!foregroundResponse.ok) throw new Error('Image de premier plan non trouvée');

    const foregroundBlob = await foregroundResponse.blob();
    const foregroundUrl = URL.createObjectURL(foregroundBlob);

    return { backgroundUrl, foregroundUrl };
  } catch (error) {
    console.error("Erreur lors de la récupération des tuiles :", error);
    return { backgroundUrl: null, foregroundUrl: null };
  }
}
,

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

  }
};
</script>

<style scoped>
/* Styles existants... */

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

.image-container {
  position: relative;
  width: 100%;
  height: auto;
}

.background-tile {
  width: 100%;
  height: auto;
}

.foreground-tile {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  clip-path: circle(50%);
}

/* Nouveaux styles pour la prévisualisation avec overlay circulaire */
.preview-container {
  position: relative;
  width: 100%;
  height: 300px;
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.map-preview {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.circular-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  margin-left: -100px;
  margin-top: -100px;
  border-radius: 50%;
  overflow: hidden;
  z-index: 2;
  border: 3px solid #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.circular-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rotation-controls {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  padding: 5px 10px;
  border-radius: 20px;
  z-index: 3;
}

.rotation-controls span {
  margin: 0 10px;
  font-weight: bold;
}

/* ... autres styles existants ... */
</style>
