<template>
    <div class="one">
      <h1>Tinder GéoCaptcha</h1>
      <p>Tuiles: {{ nb }} / OK: {{ nbOK }} / NOK: {{ nbNOK }}</p>
      <div class="captcha" @pointerdown="down(tile, $event)" @pointerup="up(tile, $event)" @mouseleave="up(tile, $event)">
        <div class="captcha-kingpin">
          <div class="layer layer-base" :style="{'background-image':`url(${getImgBase(tile)})`}"></div>
          <div class="layer layer-stacked" :style="{transform: `rotate(-${tile.angle}deg)`}">
            <div class="cropped" :style="{'background-image':`url(${getImgMatch(tile)})`}"></div>
            <div class="grab"></div>
          </div>
        </div>
      </div>
      <button class="nope" @click="setNope(tile, true)">Nope</button>
      <button class="yep" @click="setYep(tile, true)">Yep</button>
    </div>
    <div class="all">
      <button @click="getTilesOK">Voir les tuiles OK</button>
      <div class="captchas">
        <div v-for="tile in tiles" :key="tile.id" class="captcha" @pointerdown="down(tile, $event)" @pointerup="up(tile, $event)" @mouseleave="up(tile, $event)">
          <div class="captcha-kingpin">
            <div class="layer layer-base" :style="{'background-image':`url(${getImgBase(tile)})`}"></div>
            <div class="layer layer-stacked" :style="{transform: `rotate(-${tile.angle}deg)`}">
              <div class="cropped" :style="{'background-image':`url(${getImgMatch(tile)})`}"></div>
              <div class="grab"></div>
            </div>
          </div>
          <button class="nope small" @click="setNope(tile)">Nope</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  
  const BASE_GEOPF = 'https://data.geopf.fr';
  const WMTS = 'wmts?Service=WMTS&Request=GetTile&Version=1.0.0';
  const URL_GEOPF = `${BASE_GEOPF}/${WMTS}`;
  const URL_GEOPF_PRIVATE = `${BASE_GEOPF}/private/${WMTS}&apikey=ign_scan_ws`;
  
  export default {
    name: 'App',
    data() {
      return {
        captcha: null,
        nb: 0,
        nbOK: 0,
        nbNOK: 0,
        layers: {
          base: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2',
          scan: 'GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR',
          ortho: 'ORTHOIMAGERY.ORTHOPHOTOS'
        },
        private: '',
        x: null,
        y: null,
        z: null,
        mode: null,
        bboxCenter: {},
  
        tile: {},
        tiles: [],
      };
    },
    computed: {
      urlGeoPf() {
        return `https://data.geopf.fr/${this.private}wmts?Service=WMTS&Request=GetTile&Version=1.0.0&apikey=ign_scan_ws`;
      },
      imgBase() {
        return `${URL_GEOPF}&layer=${this.layers.base}&style=normal&tilematrixset=PM&Format=image/png&TileMatrix=${this.z}&TileCol=${this.x}&TileRow=${this.y}`;
      },
      imgMatch() {
        let urlGeoPf = (this.mode === 'scan') ? URL_GEOPF_PRIVATE : URL_GEOPF;
        return `${urlGeoPf}&layer=${this.layers[this.mode]}&style=normal&tilematrixset=PM&Format=image/jpeg&TileMatrix=${this.z}&TileCol=${this.x}&TileRow=${this.y}`;
      },
    },
    mounted() {
      this.getTilesNumber();
      this.getTile();
    },
    methods: {
      getTilesNumber() {
        fetch('/api/getTilesNumber')
        .then(res => res.json())
        .then(tiles => {
          this.nb = tiles.nb;
          this.nbOK = tiles.nbOK;
          this.nbNOK = tiles.nbNOK;
        });
      },
      getTile() {
        fetch('/api/getTile')
        .then(res => res.json())
        .then(tile => {
          this.tile = tile;
          this.tile.startAngle = 0;
          this.tile.angle = 20 + Math.round(Math.random() * 320);
        })
      },
      getTilesOK() {
        fetch('/api/getTilesOK')
        .then(res => res.json())
        .then(tiles => {
          this.tiles = tiles.tiles;
          this.tiles.forEach(tile => {
            tile.startAngle = 0;
            tile.angle = 20 + Math.round(Math.random() * 320);
          });
        });
      },
      down(tile, evt) {
        this.captcha = evt.currentTarget;
        let bbox = this.captcha.getBoundingClientRect();
        this.bboxCenter = {
          x: bbox.left + bbox.width / 2,
          y: bbox.top + bbox.height / 2,
        };
        tile.startAngle = (this.getAngle(evt) - tile.angle + 720) % 360;
        this.captcha._evt = this.move.bind(this, tile);
        this.captcha.addEventListener('pointermove', this.captcha._evt);
      },
      up() {
        if (this.captcha) {
          this.captcha.removeEventListener('pointermove', this.captcha._evt);
        }
      },
      move(tile, evt) {
        tile.angle = (this.getAngle(evt) - tile.startAngle + 720) % 360;
      },
      getAngle(evt) {
        return -(
          (Math.atan2(this.bboxCenter.y - evt.clientY, this.bboxCenter.x - evt.clientX) *
            180) /
          Math.PI
        );
      },
      setMatch(tile, match, newTile) {
        fetch(`/api/setMatch/${tile.x}/${tile.y}/${tile.z}/${match}`)
        .then(r => r.json())
        .then(() => {
          if (newTile) {
            this.getTile();
          }
          this.getTilesNumber();
        });
      },
      setYep(tile, newTile = false) {
        this.setMatch(tile, 1, newTile);
        this.tiles.unshift(tile);
      },
      setNope(tile, newTile = false) {
        this.setMatch(tile, -1, newTile);
        let index = this.tiles.indexOf(tile);
        if (index !== -1) {
          this.tiles.splice(index, 1);
        }
      },
      getImgBase(tile) {
        return `${URL_GEOPF}&layer=${this.layers.base}&style=normal&tilematrixset=PM&Format=image/png&TileMatrix=${tile.z}&TileCol=${tile.x}&TileRow=${tile.y}`
      },
      getImgMatch(tile) {
        let urlGeoPf = (tile.mode === 'scan') ? URL_GEOPF_PRIVATE : URL_GEOPF;
        return `${urlGeoPf}&layer=${this.layers[tile.mode]}&style=normal&tilematrixset=PM&Format=image/jpeg&TileMatrix=${tile.z}&TileCol=${tile.x}&TileRow=${tile.y}`;
      }
    }
  
  }
  </script>
  
  <style>
    body {
    margin: 0;
    min-height: 100vh;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    min-height: 100vh;
  }
  
  .one {
    margin-top: 60px;
  }
  .all {
    margin-top: 50px;
    padding-top: 60px;
    background: lightgray;
  }
  .captchas {
    display: flex;
    flex-wrap: wrap;
  }
  .captcha {
    width: 256px;
    height:200px;
    margin: 50px auto;
    box-shadow:0 0 0 1px;
    background:#d3d3d3;
    user-select: none;
  }
  
  .captcha-kingpin {
    position:relative;
    width: 100%;
    height:200px;
    overflow:hidden
  }
  .captcha-kingpin .layer {
    position:absolute;
    width:100%;
    height:100%;
    background-position:50% 50%
  }
  .captcha-kingpin .layer-stacked {
    cursor:grab;
    position:absolute;
    width:150px;
    height:150px;
    top:25px;
    left:0;
    right:0;
    margin:auto
  }
  .captcha-kingpin .cropped {
    position:absolute;
    width:100%;
    height:100%;
    border-radius:50%;
    overflow:hidden;
    box-shadow:0 0 1px 3px,0 0 0 15px rgba(36,60,71,.25);
    background-position:50% 50%
  }
  .captcha-kingpin .grab {
    cursor:grab;
    position:absolute;
    z-index:1;
    right:-10px;
    top:60px;
    width:20px;
    height:30px;
    border-radius:3px;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 30'%3E%3Cpath d='m5,10h10M5,15h10M5,20h10' stroke='white' stroke-width='2'/%3E%3C/svg%3E");
    background-color:#243c47
  }
  .captcha-kingpin .grab:hover {
    background-color:#30a7df
  }
  
  button {
    min-width: 150px;
    font-size: 1.4em;
    margin: 10px;
    padding: 10px;
    border: 0;
    border-radius: 5px;
  }
  
  .small {
    min-width: 0;
    font-size: 1em;
  }
  
  .yep {
    background: lightgreen;
  }
  .nope {
    background: lightcoral;
  }
  
  button:hover {
    color: white;
    box-shadow: 0 0 0 3px lightgray;
  }
  
  .yep:hover {
    background: green;
  }
  .nope:hover {
    background: red;
  }
  </style>