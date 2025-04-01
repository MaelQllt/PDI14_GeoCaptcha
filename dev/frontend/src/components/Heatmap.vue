<template>
  <div class="map-container">
    <!-- Conteneur de la carte qui sera référencé par this.$refs.map -->
    <div id="map" ref="map"></div>

    <!-- Légende de la heatmap -->
    <div v-if="showLegend" class="legend-overlay">
      <div class="legend-header">
        <h3>Légende</h3>
        <button class="dsfr-close-button" @click="toggleLegend">
          <span class="fr-icon-close-line fr-icon--sm" aria-hidden="true"></span>
        </button>
      </div>
      <p>Présence de GéoCaptcha :</p>
      <div class="legend-gradient">
        <div class="gradient"></div>
        <div class="labels">
          <span>Faible présence</span>
          <span>Forte présence</span>
        </div>
      </div>
    </div>
    <div v-else class="legend-toggle" @click="toggleLegend">
      <span class="fr-icon-arrow-up-s-line"></span>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import Heatmap from 'ol/layer/Heatmap';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';

export default {
  name: 'Heatmap',
  data() {
    return {
      coordinates: [],
      heatmapLayer: null,
      showLegend: true, // État pour la visibilité de la légende
    };
  },
  mounted() {
    this.fetchAllTileCoordinates();
  },
  methods: {
    async fetchAllTileCoordinates() {
      let allCoordinates = [];
      let firstObject = 1;
      const nbObjects = 20;

      try {
        while (true) {
          const response = await fetch(`https://qlf-geocaptcha.ign.fr/api/v1/admin/kingpin?firstObject=${firstObject}&nbObjects=${nbObjects}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-api-key': import.meta.env.VITE_API_KEY,
              'x-app-id': import.meta.env.VITE_API_ID,
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Erreur API:', response.status, errorText);
            throw new Error(`Erreur réseau: ${response.status} - ${response.statusText}`);
          }

          const data = await response.json();
          if (!data || !data.kingpin || !Array.isArray(data.kingpin)) {
            throw new Error('Format de données inattendu');
          }

          const tileCoordinates = data.kingpin.map(item => item.tileCoord);

          const rawCoordinates = tileCoordinates.map(({ x, y }) => {
            const { lat, lon } = this.tileToLatLon(x, y, 15);
            return {
              lat: parseFloat(lat.toFixed(6)),
              lon: parseFloat(lon.toFixed(6)),
            };
          });

          allCoordinates.push(...rawCoordinates);

          if (data.kingpin.length < nbObjects) {
            break;
          }

          firstObject += nbObjects;
        }

        this.coordinates = this.removeDuplicateCoordinates(allCoordinates);
        this.initMap();
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    },

    removeDuplicateCoordinates(coords) {
      const uniqueCoords = [];
      const seen = new Set();

      for (const coord of coords) {
        const key = `${coord.lat}_${coord.lon}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueCoords.push(coord);
        }
      }

      return uniqueCoords;
    },

    tileToLatLon(x, y, z) {
      const n = Math.pow(2, z);
      const lon = x / n * 360 - 180;
      const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)));
      const lat = latRad * 180 / Math.PI;
      return { lat, lon };
    },

    initMap() {
      const features = this.coordinates.map(coord => {
        const olCoord = fromLonLat([coord.lon, coord.lat]);
        return new Feature(new Point(olCoord));
      });

      const vectorSource = new VectorSource({
        features,
      });

      const heatmapColors = [
        'rgba(0, 0, 255, 0)',
        'rgba(0, 0, 255, 0.5)',
        'rgba(0, 255, 255, 0.7)',
        'rgba(0, 255, 0, 0.7)',
        'rgba(255, 255, 0, 0.7)',
        'rgba(255, 128, 0, 0.7)',
        'rgba(255, 0, 0, 0.9)'
      ];

      this.heatmapLayer = new Heatmap({
        source: vectorSource,
        blur: 15,
        radius: 10,
        gradient: heatmapColors,
      });

      new Map({
        target: this.$refs.map,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://data.geopf.fr/wmts?' +
                   'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&TILEMATRIXSET=PM' +
                   '&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png' +
                   '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}',
              attributions: 'Carte © IGN/Geoplateforme',
            }),
          }),
          this.heatmapLayer,
        ],
        view: new View({
          center: fromLonLat([2.45407, 46.80335]),
          zoom: 5.75,
          maxZoom: 15,
        }),
      });
    },

    toggleLegend() {
      this.showLegend = !this.showLegend;
    },
  },
};
</script>

<style scoped>
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

.legend-overlay {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 350px;
  background-color: rgba(255, 255, 255, 0.85);
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 30;
}

.legend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

/* Bouton de fermeture DSFR */
.dsfr-close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #000; /* Adapter selon le style DSFR */
  position: absolute;
  top: 0px;
  right: 1px;
}

/* Icône de la flèche DSFR */
.legend-toggle {
  position: absolute;
  bottom: 20px;
  left: 20px;
  padding: 10px 15px;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 30;
  font-size: 1.5rem; /* Ajuste la taille de l'icône */
}


.legend-header h3 {
  margin-top: 0;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}

.toggle-icon {
  cursor: pointer;
  font-size: 16px;
  user-select: none;
}

.legend-toggle {
  position: absolute;
  bottom: 20px;
  left: 20px;
  padding: 10px 15px;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 30;
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
