# 🇫🇷 Système de Design de l’État

[![GitHub release](https://img.shields.io/github/v/release/gouvernementFR/dsfr.svg)](https://GitHub.com/gouvernementFR/dsfr/releases/) 
[![Generic badge](https://img.shields.io/badge/npm-yellow.svg)](https://www.npmjs.com/package/@gouvfr/dsfr) 
[![Generic badge](https://img.shields.io/badge/license-grey.svg)](https://github.com/GouvernementFR/dsfr/blob/main/LICENSE.md) 
[![Npm package monthly downloads](https://badgen.net/npm/dm/@gouvfr/dsfr)](https://npmjs.com/package/@gouvfr/dsfr)

Le **Système de Design de l’État** (**DSFR**) est un ensemble de composants web HTML, CSS et Javascript pour faciliter le travail des équipes projets des sites Internet publics, et créer des interfaces numériques de qualité et accessibles.

Cet outil est développé, maintenu et géré par le [Service d'Information du Gouvernement (SIG)](https://www.gouvernement.fr/service-d-information-du-gouvernement-sig).

> Son utilisation par les administrations est soumise à une demande d'agrément (voir partie 5 des Conditions Générales d'Utilisation).

🔗 **[Voir la documentation officielle](https://www.systeme-de-design.gouv.fr)**

---

## 📝 Licence et droit d'utilisation

Le contenu de ce projet est placé sous licence **MIT License**, à l'exception de la fonte Marianne. 
📄 Voir [LICENSE.md](https://github.com/GouvernementFR/dsfr/blob/main/LICENSE.md).

### ⚠️ Utilisation interdite en dehors des sites Internet de l'État

> Il est **formellement interdit** à tout autre acteur d’utiliser le **Système de Design de l’État** (les administrations territoriales ou tout autre acteur privé) pour des sites web ou des applications.
> 
> 🚨 **Le DSFR représente l’identité numérique de l’État.** En cas d’usage à des fins trompeuses ou frauduleuses, l'État se réserve le droit d’entreprendre les actions nécessaires pour y mettre un terme.

📌 Voir les [Conditions Générales d'Utilisation](doc/legal/cgu.md).

### ⚠️ Prohibited Use Outside Government Websites

> This Design System is **only meant** to be used by official French public services' websites and apps. Its main purpose is to make it easy to identify governmental websites for citizens. **See terms.**

---

## 🚀 Installation

L'installation du **DSFR** peut se faire de différentes manières :
- 📥 En téléchargeant les fichiers nécessaires
- 📦 Via **NPM**
- 🔄 En utilisant **Git**

### 📁 Fichiers statiques

Téléchargez l'ensemble du **DSFR** au format ZIP contenant :
- Fichiers **CSS** et **JavaScript**
- Polices **Marianne** et **Spectral**
- Icônes et pictogrammes

🔗 **[Page Release GitHub](https://github.com/GouvernementFR/dsfr/releases)**

### 📦 Installation via NPM

Le **DSFR** est disponible sur **NPM** et peut être ajouté directement à votre projet. **NodeJS** est requis.

```sh
npm install @gouvfr/dsfr
```

Avec **Yarn** :
```sh
yarn add @gouvfr/dsfr
```

Les fichiers seront installés dans :
```sh
node_modules/@gouvfr/dsfr/
```

### 🔥 Démarrage rapide avec un serveur local

1. Installez **browser-sync** :
   ```sh
   npm install browser-sync
   ```
2. Démarrez le serveur :
   ```sh
   cd node_modules/@gouvfr/dsfr/
   npm run serve
   ```
3. Accédez aux exemples via : [http://localhost:8080/example/](http://localhost:8080/example/)

---

## 📂 Structure du DSFR

Le package DSFR inclut les dossiers suivants :

```
📦 dsfr
├── 📂 dist        # Fichiers CSS et JS
├── 📂 src         # Sources SASS et JS
├── 📂 example     # Exemples HTML
```

### 📌 Configuration de votre projet

Une structure minimale :

```
/ Racine du projet
└── index.html
└── dsfr.min.css
└── dsfr.module.min.js
└── dsfr.nomodule.min.js
└── icons/
└── favicon/
└── fonts/
└── utility/
    └── utility.min.css
```

Les polices **Marianne** et **Spectral** doivent être placées dans `fonts/`. Assurez-vous de bien respecter cette arborescence pour garantir un bon fonctionnement.

---

## 🏗 Le HTML de base

Ajoutez l’attribut **data-fr-scheme** sur la balise `<html>` pour activer le mode clair/sombre :

```html
<!doctype html>
<html lang="fr" data-fr-scheme="system">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no">
    <meta name="theme-color" content="#000091">
    <link rel="stylesheet" href="dsfr.min.css">
    <link rel="stylesheet" href="utility/utility.min.css">
    <title>Mon site - DSFR</title>
  </head>
  <body>
    <!-- Contenu -->
  </body>
</html>
```

📌 [Voir la documentation des paramètres d’affichage](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/parametre-d-affichage)
