# Documentation Développeur

[![GitHub release](https://img.shields.io/badge/release-v1.0.0-blue)](https://github.com/MaelQllt/PDI14_GeoCaptcha) [![Generic badge](https://img.shields.io/badge/npm-yellow.svg)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) [![Generic badge](https://img.shields.io/badge/Vue-blue.svg)](https://vuejs.org/) [![Generic badge](https://img.shields.io/badge/Réalisé_par-Etudiants_de_l'ENSG-brightgreen.svg)](https://ensg.eu/fr) [![Generic badge](https://img.shields.io/badge/GéoCaptcha-IGN-brightgreen.svg)](https://github.com/IGNF/GeocaptchaAPI) 

La **MARS** (Mission Architecture Réseau et Sécurité) de l'**IGN** (Institut National de l'information géographiques et forestière) a développé un
système de Captcha innovant basé sur des données géographiques appelé: GéoCaptcha.

[Voir documentation du GéoCaptcha](https://github.com/IGNF/GeocaptchaAPI/blob/master/README.md)

Afin de gérer ces défis, il est nécessaire de mettre en place une interface administrateur avec différentes fonctionnalités:
- Administration de clés d'accès à l'API
- Visualisation des défis à l'aide de métriques et de logs
- Gestion de nouveaux défis 

Toutefois, pour cette interface il est obligatoire qu'elle respecte le [Système de Design de l'État](https://www.systeme-de-design.gouv.fr) puisque l'IGN en fait partie.

## Installation du Système de Design de l'État

>Le Système de Design de l’État (ci-après, le **DSFR**) est un ensemble de composants web HTML, CSS et Javascript pour faciliter le travail des équipes projets des sites Internet publics, et créer des interfaces numériques de qualité et accessibles.

>L'outil est développé, maintenu et géré par le [Service d'Information du Gouvernement (SIG)](https://www.gouvernement.fr/service-d-information-du-gouvernement-sig).

La méthode la plus optimale pour installer et utiliser le DSFR est de se servir de **npm**. Pour ce faire, veuillez vérifier que **node.js** et **npm** soit bien installé sur votre machine.
Si ce n'est pas le cas, vous pouvez suivre la [documentation officielle de npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Une fois **npm** bien installé, ouvrez votre terminal et rentrez ceci pour installer le DSFR:

```
npm install @gouvfr/dsfr
```

Une fois terminé le DSFR sera alors installé dans le dossier:
**node_modules/@gouvfr/dsfr/**





