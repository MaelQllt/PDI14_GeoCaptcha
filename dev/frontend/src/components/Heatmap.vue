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
  import {XYZ} from 'ol/source';
  import { fromLonLat, toLonLat } from "ol/proj";
  
  export default {
    name: 'Heatmap',
    data() {
      return {
        coordinates: [],
      };
    },
    mounted() {
      this.extractTileCoordinates();
    },
    methods: {
      async extractTileCoordinates() {
        try {
          // Appel à l'API pour récupérer les données kingpin avec vérification d'erreur
          const response = await fetch('https://qlf-geocaptcha.ign.fr/api/v1/admin/kingpin?firstObject=21&nbObjects=20', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-api-key': import.meta.env.VITE_API_KEY,
              'x-app-id': import.meta.env.VITE_API_ID,
            },
          });
  
          // Vérifier si la réponse est OK avant de traiter les données
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Erreur API:', response.status, errorText);
            throw new Error(`Erreur réseau: ${response.status} - ${response.statusText}`);
          }
  
          const data = await response.json();
          console.log('Données reçues:', data); // Pour débugger
  
          // Vérifier que data et data.kingpin existent
          if (!data || !data.kingpin || !Array.isArray(data.kingpin)) {
            throw new Error('Format de données inattendu');
          }
  
          const tileCoordinates = data.kingpin.map(item => item.tileCoord);
  
          // Convertir les coordonnées de tuiles en lat/lon
          const rawCoordinates = tileCoordinates.map(({ x, y }) => {
            const { lat, lon } = this.tileToLatLon(x, y, 15);
            // Arrondir pour faciliter la comparaison des doublons
            return { 
              lat: parseFloat(lat.toFixed(6)), 
              lon: parseFloat(lon.toFixed(6)) 
            };
          });
  
          // Supprimer les doublons
          this.coordinates = this.removeDuplicateCoordinates(rawCoordinates);
  
          console.log('Coordonnées originales:', rawCoordinates.length);
          console.log('Coordonnées après déduplication:', this.coordinates.length);
          
          // Initialiser la carte une fois les coordonnées extraites
          this.initMap();
        } catch (error) {
          console.error('Erreur lors du chargement des données:', error);
          // Vous pourriez vouloir afficher un message d'erreur à l'utilisateur ici
        }
      },
  
      removeDuplicateCoordinates(coords) {
        const uniqueCoords = [];
        const seen = new Set();
        
        for (const coord of coords) {
          // Créer une clé unique pour chaque coordonnée
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
        // Vérifier que nous avons des coordonnées
        if (!this.coordinates || this.coordinates.length === 0) {
          console.warn('Aucune coordonnée disponible pour initialiser la carte');
          // Initialiser une carte vide centrée sur la France
          new Map({
            target: this.$refs.map,
            layers: [
              new TileLayer({
                source: new OSM(),
              }),
            ],
            view: new View({
              center: fromLonLat([2.45407, 46.80335]),
              zoom: 5.75,
            }),
          });
          return;
        }
  
        // Convertir les coordonnées lat/lon en coordonnées projetées OpenLayers
        const features = this.coordinates.map(coord => {
          const olCoord = fromLonLat([coord.lon, coord.lat]); // Convertir en format OpenLayers
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
  
        // Calculer le centre de la vue à partir des coordonnées
        let centerLat = 0;
        let centerLon = 0;
        
        if (this.coordinates.length > 0) {
          centerLat = this.coordinates.reduce((sum, coord) => sum + coord.lat, 0) / this.coordinates.length;
          centerLon = this.coordinates.reduce((sum, coord) => sum + coord.lon, 0) / this.coordinates.length;
        } else {
          // Valeur par défaut (France)
          centerLat = 46.80335;
          centerLon = 2.45407;
        }
  
        new Map({
          target: this.$refs.map,
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
            heatmapLayer,
          ],
          view: new View({
            center: fromLonLat([centerLon, centerLat]), // Utiliser le centre calculé
            zoom: 5.75, // Zoom ajusté pour mieux voir la heatmap
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