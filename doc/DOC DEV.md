# Documentation Développeur

[![GitHub release](https://img.shields.io/badge/release-v0.0.1-blue)](https://github.com/MaelQllt/PDI14_GeoCaptcha) [![Generic badge](https://img.shields.io/badge/npm-yellow.svg)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) [![Generic badge](https://img.shields.io/badge/Vue-blue.svg)](https://vuejs.org/) [![Generic badge](https://img.shields.io/badge/Réalisé_par-Etudiants_de_l'ENSG-brightgreen.svg)](https://ensg.eu/fr) [![Generic badge](https://img.shields.io/badge/GéoCaptcha-IGN-brightgreen.svg)](https://github.com/IGNF/GeocaptchaAPI) 


La **MARS** (Mission Architecture Réseau et Sécurité) de l'**IGN** (Institut National de l'information géographiques et forestière) a développé un système de Captcha innovant basé sur des données géographiques appelé: GéoCaptcha.

[Voir documentation du GéoCaptcha](https://github.com/IGNF/GeocaptchaAPI/blob/master/README.md)

Afin de gérer ces défis, il est nécessaire de mettre en place une interface administrateur avec différentes fonctionnalités:

- Administration de clés d'accès à l'API
- Visualisation des défis à l'aide de métriques et de logs
- Gestion de nouveaux défis

Toutefois, pour cette interface il est obligatoire qu'elle respecte le [Système de Design de l'État](https://www.systeme-de-design.gouv.fr) puisque l'IGN en fait partie.

## Installation du Système de Design de l'État

> Le Système de Design de l’État (ci-après, le **DSFR**) est un ensemble de composants web HTML, CSS et Javascript pour faciliter le travail des équipes projets des sites Internet publics, et créer des interfaces numériques de qualité et accessibles.

> L'outil est développé, maintenu et géré par le [Service d'Information du Gouvernement (SIG)](https://www.gouvernement.fr/service-d-information-du-gouvernement-sig).

La méthode la plus optimale pour installer et utiliser le DSFR est de se servir de **npm**. Pour ce faire, veuillez vérifier que **node.js** et **npm** soit bien installé sur votre machine. Si ce n'est pas le cas, vous pouvez suivre la [documentation officielle de npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Une fois **npm** bien installé, ouvrez votre terminal et rentrez ceci pour installer le DSFR:

```
npm install @gouvfr/dsfr
```

Une fois terminé le DSFR sera alors installé dans le dossier: **node\_modules/@gouvfr/dsfr/**

Vous pouvez d'ailleurs visualiser les composants, fondamentaux et autres éléments du DSFR en local ainsi:

```
npm install browser-sync
cd node_modules/@gouvfr/dsfr/
npm run serve
```

Une fois le serveur lancé, les exemples sont disponibles à l'adresse : [http://localhost:8080/example/](http://localhost:8080/example/)

**Attention**: le port peut être un autre que 8080, suivez la réponse de votre terminal en priorité.

## Autres installations

### Installation de Vite

Etant donné que nous travaillons en Vue, la visualisation de notre frontend via [Vite](https://vitejs.fr/guide/) correspond exactement à nos besoins.

Pour l'installer vous pouvez simplement exécuter cette ligne :

```
npm install vite
```

### Installation de OpenLayers

Nous avons choisi [OpenLayers](https://openlayers.org/) pour ses nombreux avantages :
Open-source, librairie cartographique permettant de répondre à des besoins avancés.

Pour l'installer vous pouvez simplement exécuter cette ligne :

```
npm install ol
```

### Installation de Turf

Ayant besoin de gérer des données GeoJSON, [Turf](https://turfjs.org/) est la meilleure option pour ce besoin.

Pour l'installer vous pouvez simplement exécuter cette ligne :

```
npm install @turf/turf
```

## Lancement du projet sur le Network

Afin de lancer le projet nous allons utiliser, une fois encore, **npm**. Pour ce faire rendez vous dans votre terminal ouvert dans votre dossier frontend. Faites ensuite cette requête:

```
npm run dev -- --host
```

Ainsi vous devriez obtenir un accès local et network au projet, vous pouvez copier-coller le network sur votre navigateur.

```js
Local:   http://localhost:5176/
Network: http://192.0.0.2:5176/
```

**Attention**: le port peut être un autre que 5176, suivez la réponse de votre terminal en priorité.

## Guide Technique

### Structure du Code

Le projet est organisé selon l'architecture suivante:

- **dev/** : Contient le code
    - **frontend/** : Contient l'interface utilisateur basée sur Vue et DSFR
    - **src/** : Code source Vue
        - **assets/** : Images et autre ajout visuel
        - **components/** : Composants réutilisables (header, footer et dark mode)
        - **views/** : Pages principales
        - **router/** : Gestion des routes
    - **package.json** : Gestion des dépendances et scripts
    - **backend/** : API et gestion des données (ici nous avons utilisé le backend pour des json factices quans l'API ne fonctionnait pas)

### Choix Technologiques

- **Vue.js** : Framework principal pour le frontend
- **Vite** : Outil de build rapide pour Vue
- **DSFR** : Système de design gouvernemental
- **Node.js & npm** : Gestion des dépendances

### Etapes de Développement

1. Installation des dépendances: `npm install`
2. Développement des composants Vue et intégration DSFR
3. Implémentation des fonctionnalités

### Contribuer au Projet

1. Forker le dépôt
2. Cloner le projet: `git clone https://github.com/MaelQllt/PDI14_GeoCaptcha.git`
3. Créer une branche: `git checkout -b nouvelle-fonctionnalité`
4. Faire vos modifications et tester
5. Committer et pusher: `git commit -m "Ajout d'une fonctionnalité" && git push`
6. Ouvrir une Pull Request sur GitHub

### Environnement de Développement

- **Node.js v16+**
- **Vue CLI ou Vite**
- **Navigateurs supportés** : Chrome, Firefox, Edge, Safari
- **API GéoCaptcha** : Documentation disponible [ici](https://github.com/IGNF/GeocaptchaAPI)

---

https://github.com/gregoiredavid/france-geojson/blob/master/regions-avec-outre-mer.geojson

Cette documentation est amenée à évoluer avec le projet. Bonne contribution ! 

