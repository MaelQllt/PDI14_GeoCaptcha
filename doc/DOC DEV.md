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

```sh
npm install @gouvfr/dsfr
```

Une fois terminé le DSFR sera alors installé dans le dossier: **node_modules/@gouvfr/dsfr/**

Vous pouvez d'ailleurs visualiser les composants, fondamentaux et autres éléments du DSFR en local ainsi:

```sh
npm install browser-sync
cd node_modules/@gouvfr/dsfr/
npm run serve
```

Une fois le serveur lancé, les exemples sont disponibles à l'adresse : [http://localhost:8080/example/](http://localhost:8080/example/)

**Attention**: le port peut être un autre que 8080, suivez la réponse de votre terminal en priorité.

## Autres installations

### Installation de Vite

```sh
npm install vite
```

### Installation de OpenLayers

```sh
npm install ol
```

### Installation de Turf

```sh
npm install @turf/turf
```

### Installation d'Axios

```sh
npm install axios
```

## Pour utiliser l'API 

Créer un fichier `.env` dans le dossier `dev/frontend` et y ajouter :

```ini
VITE_API_KEY= 
VITE_API_ID= 
```

Ne jamais commit ces informations sur Git.

## Lancement du projet sur le Network

```sh
npm run dev -- --host
```

Exemple d'accès local et network:

```js
Local:   http://localhost:5176/
Network: http://192.0.0.2:5176/
```

**Attention**: le port peut être différent.

## Guide Technique

### Structure du Code

- **dev/** : Contient le code
    - **frontend/** : Interface utilisateur basée sur Vue et DSFR
    - **src/** : Code source Vue
        - **assets/** : Images et ajouts visuels
        - **components/** : Composants réutilisables
        - **views/** : Pages principales
        - **router/** : Gestion des routes
    - **backend/** : API et gestion des données

### Choix Technologiques

- **Vue.js**
- **Vite**
- **DSFR**
- **Node.js & npm**

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
- **API GéoCaptcha** : [Documentation](https://github.com/IGNF/GeocaptchaAPI)

---

https://github.com/gregoiredavid/france-geojson/blob/master/regions-avec-outre-mer.geojson

Cette documentation est amenée à évoluer avec le projet. Bonne contribution !
