<template>
  <div id="map" ref="map" style="width: 100%; height: 500px;"></div>
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
              lon: parseFloat(lon.toFixed(6))
            };
          });

          allCoordinates.push(...rawCoordinates);

          // Si moins de 20 objets sont retournés, cela signifie que nous avons atteint la fin
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

      const heatmapLayer = new Heatmap({
        source: vectorSource,
        blur: 15,
        radius: 10,
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
              attributions: 'Carte © IGN/Geoplateforme'
            }),
          }),
          heatmapLayer,
        ],
        view: new View({
          center: fromLonLat([2.45407, 46.80335]),
          zoom: 5.75,
          maxZoom: 15,
        }),
      });
    },
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 500px;
  margin-bottom: 50px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
