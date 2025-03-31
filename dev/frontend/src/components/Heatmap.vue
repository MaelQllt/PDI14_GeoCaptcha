<template>
    <div id="map" ref="map" style="width: 100%; height: 500px;"></div>
  </template>
  
  <script>
  import 'ol/ol.css';
  import { Map, View } from 'ol';
  import TileLayer from 'ol/layer/Tile';
  import OSM from 'ol/source/OSM';
  import Heatmap from 'ol/layer/Heatmap';
  import VectorSource from 'ol/source/Vector';
  import Feature from 'ol/Feature';
  import Point from 'ol/geom/Point';
  import { fromLonLat, toLonLat } from 'ol/proj';
  import { register } from 'ol/proj/proj4';
  import proj4 from 'proj4';
  
  export default {
    name: 'Heatmap',
    props: {
      geocaptchaData: {
        type: Array,
        required: true
      }
    },
    mounted() {
      // Enregistrer la projection Lambert 93 (EPSG:2154)
      proj4.defs('EPSG:2154', '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
      register(proj4);
  
      this.initMap();
    },
    methods: {
      initMap() {
        const features = this.geocaptchaData.map(data => {
          // Convertir les coordonnées de Lambert 93 à WGS 84
          const coordinates = [data.x, data.y];
          const transformedCoords = toLonLat(coordinates, 'EPSG:2154');
  
          const feature = new Feature({
            geometry: new Point(fromLonLat(transformedCoords)),
            weight: data.successRate // Utilisez le taux de réussite comme poids pour la carte de chaleur
          });
          return feature;
        });
  
        const vectorSource = new VectorSource({
          features: features
        });
  
        const heatmapLayer = new Heatmap({
          source: vectorSource,
          blur: 15,
          radius: 5
        });
  
        new Map({
          target: this.$refs.map,
          layers: [
            new TileLayer({
              source: new OSM()
            }),
            heatmapLayer
          ],
          view: new View({
            center: fromLonLat([2.3522, 48.8566]), // Centre de la carte (Paris, France)
            zoom: 5
          })
        });
      }
    }
  };
  </script>
  
  <style scoped>
  #map {
    width: 100%;
    height: 100%;
  }
  </style>
  