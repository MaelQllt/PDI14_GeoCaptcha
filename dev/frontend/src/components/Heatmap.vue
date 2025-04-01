<template>
  <div class="map-container">
    <!-- Conteneur de la carte qui sera référencé par this.$refs.map -->
    <div id="map" ref="map"></div>
    
    <!-- Légende de la carte thermique superposée -->
    <div class="legend-overlay">
      <h3>Légende</h3>
      <p>Présence de GéoCaptcha en France :</p>
      <div class="legend-gradient">
        <div class="gradient"></div>
        <div class="labels">
          <span>Faible présence</span>
          <span></span>
          <span>Forte présence</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*Bibliothèque OpenLayers*/
import 'ol/ol.css'; // Styles CSS pour OpenLayers
import { Map, View } from 'ol'; // Classes principales pour la carte et la vue
import TileLayer from 'ol/layer/Tile'; // Couche de tuiles (fond de carte)
import XYZ from 'ol/source/XYZ'; // Source de données XYZ pour les tuiles
import Heatmap from 'ol/layer/Heatmap'; // Couche de carte thermique
import VectorSource from 'ol/source/Vector'; // Source de données vectorielles
import Feature from 'ol/Feature'; // Classe pour représenter une entité géographique
import Point from 'ol/geom/Point'; // Géométrie de type point
import { fromLonLat } from 'ol/proj'; // Fonction de conversion de coordonnées

export default {
  name: 'Heatmap', // Nom du composant
  data() {
    return {
      coordinates: [], // Stockage des coordonnées pour la carte de chaleur
      heatmapLayer: null, // Référence à la couche de carte thermique
    };
  },
  mounted() {
    // Appel de la méthode pour récupérer les coordonnées dès que le composant est monté
    this.fetchAllTileCoordinates();
  },
  methods: {
    async fetchAllTileCoordinates() {
      // Méthode pour récupérer toutes les coordonnées des tuiles depuis l'API
      let allCoordinates = []; // Tableau pour stocker toutes les coordonnées
      let firstObject = 1; // Index du premier objet à récupérer
      const nbObjects = 20; // Nombre d'objets par requête

      try {
        // Boucle pour récupérer toutes les données par lots
        while (true) {
          // Appel à l'API IGN Géocaptcha pour récupérer les données
          const response = await fetch(`https://qlf-geocaptcha.ign.fr/api/v1/admin/kingpin?firstObject=${firstObject}&nbObjects=${nbObjects}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-api-key': import.meta.env.VITE_API_KEY, // Clé API stockée dans les variables d'environnement
              'x-app-id': import.meta.env.VITE_API_ID, // ID d'application stocké dans les variables d'environnement
            },
          });

          // Vérification de la réponse HTTP
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Erreur API:', response.status, errorText);
            throw new Error(`Erreur réseau: ${response.status} - ${response.statusText}`);
          }

          // Conversion de la réponse en JSON
          const data = await response.json();
          if (!data || !data.kingpin || !Array.isArray(data.kingpin)) {
            throw new Error('Format de données inattendu');
          }

          // Extraction des coordonnées des tuiles
          const tileCoordinates = data.kingpin.map(item => item.tileCoord);
          
          // Conversion des coordonnées de tuiles en coordonnées géographiques (latitude/longitude)
          const rawCoordinates = tileCoordinates.map(({ x, y }) => {
            const { lat, lon } = this.tileToLatLon(x, y, 15); // Niveau de zoom 15
            return {
              lat: parseFloat(lat.toFixed(6)), // Arrondi à 6 décimales
              lon: parseFloat(lon.toFixed(6)), // Arrondi à 6 décimales
            };
          });

          // Ajout des nouvelles coordonnées au tableau global
          allCoordinates.push(...rawCoordinates);

          // Si nous avons récupéré moins d'objets que demandé, nous avons atteint la fin des données
          if (data.kingpin.length < nbObjects) {
            break;
          }

          // Mise à jour de l'index pour la prochaine requête
          firstObject += nbObjects;
        }

        // Élimination des coordonnées dupliquées
        this.coordinates = this.removeDuplicateCoordinates(allCoordinates);
        
        // Initialisation de la carte avec les coordonnées récupérées
        this.initMap();
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    },

    removeDuplicateCoordinates(coords) {
      // Méthode pour éliminer les coordonnées dupliquées
      const uniqueCoords = [];
      const seen = new Set(); // Ensemble pour suivre les coordonnées déjà vues

      for (const coord of coords) {
        // Création d'une clé unique pour chaque coordonnée
        const key = `${coord.lat}_${coord.lon}`;
        if (!seen.has(key)) {
          // Si la coordonnée n'est pas encore vue, l'ajouter
          seen.add(key);
          uniqueCoords.push(coord);
        }
      }

      return uniqueCoords;
    },

    tileToLatLon(x, y, z) {
      // Méthode pour convertir les coordonnées de tuile (x, y, z) en coordonnées géographiques (lat, lon)
      const n = Math.pow(2, z); // Calcul du nombre de tuiles par rangée/colonne au niveau de zoom z
      const lon = x / n * 360 - 180; // Conversion de la coordonnée x en longitude
      const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))); // Calcul de la latitude en radians
      const lat = latRad * 180 / Math.PI; // Conversion en degrés
      return { lat, lon };
    },

    initMap() {
      // Méthode pour initialiser la carte OpenLayers
      
      // Création des entités (points) pour chaque coordonnée
      const features = this.coordinates.map(coord => {
        // Conversion des coordonnées WGS84 (lon/lat) en projection utilisée par OpenLayers
        const olCoord = fromLonLat([coord.lon, coord.lat]);
        return new Feature(new Point(olCoord));
      });

      // Création d'une source de données vectorielle contenant les points
      const vectorSource = new VectorSource({
        features,
      });

      // Configuration des couleurs de la carte thermique
      // Utilisation d'un dégradé de bleu à rouge en passant par le jaune
      const heatmapColors = [
        'rgba(0, 0, 255, 0)',    // Transparent pour les valeurs très faibles
        'rgba(0, 0, 255, 0.5)',  // Bleu pour les valeurs faibles
        'rgba(0, 255, 255, 0.7)', // Cyan
        'rgba(0, 255, 0, 0.7)',   // Vert
        'rgba(255, 255, 0, 0.7)', // Jaune
        'rgba(255, 128, 0, 0.7)', // Orange
        'rgba(255, 0, 0, 0.9)'    // Rouge pour les valeurs élevées
      ];

      // Création de la couche de carte thermique
      this.heatmapLayer = new Heatmap({
        source: vectorSource,
        blur: 15,  // Niveau de flou pour adoucir la visualisation
        radius: 10, // Rayon de chaque point sur la carte thermique
        gradient: heatmapColors, // Utilisation du dégradé personnalisé
      });

      // Création de la carte OpenLayers
      new Map({
        target: this.$refs.map, // Élément DOM où la carte sera rendue
        layers: [
          // Couche de fond de carte (Plan IGN)
          new TileLayer({
            source: new XYZ({
              url: 'https://data.geopf.fr/wmts?' +
                   'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&TILEMATRIXSET=PM' +
                   '&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png' +
                   '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}',
              attributions: 'Carte © IGN/Geoplateforme', // Attribution légale
            }),
          }),
          this.heatmapLayer, // Ajout de la couche de carte thermique
        ],
        view: new View({
          center: fromLonLat([2.45407, 46.80335]), // Centre de la carte (coordonnées approximatives de la France)
          zoom: 5.75, // Niveau de zoom initial
          maxZoom: 15, // Niveau de zoom maximum
        }),
      });
    },
  },
};
</script>

<style scoped>
/* Styles CSS pour le conteneur de la carte */
.map-container {
  position: relative;
  width: 100%;
  height: 500px;
  margin-bottom: 50px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

#map {
  width: 100%; 
  height: 100%;
}

/* Styles pour la légende superposée */
.legend-overlay {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 350px;
  background-color: rgba(255, 255, 255, 0.85);
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 1000; /* S'assure que la légende est au-dessus de la carte */
}

.legend-overlay h3 {
  margin-top: 0;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}

.legend-overlay p {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 12px;
  color: #555;
}

.legend-gradient {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.gradient {
  height: 16px;
  width: 100%;
  border-radius: 4px;
  background: linear-gradient(to right, 
    rgba(0, 0, 255, 0.5),  
    rgba(0, 255, 255, 0.7), 
    rgba(0, 255, 0, 0.7), 
    rgba(255, 255, 0, 0.7),
    rgba(255, 128, 0, 0.7), 
    rgba(255, 0, 0, 0.9)    
  );
}

.labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #444;
}
</style>