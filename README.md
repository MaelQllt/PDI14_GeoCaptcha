# 🚀 CaptchAdmin

## 🌍 Pourquoi CaptchAdmin ?

Lorsque vous naviguez sur Internet, il vous est souvent demandé de prouver que vous êtes un humain à l’aide d’un captcha. Ces défis, souvent sous forme de textes déformés ou de séquences d’images, peuvent être contraignants.

L’**IGN**, par l’intermédiaire de la **Mission Architecture Réseau et Sécurité (MARS)**, a développé un système innovant : **les GéoCaptcha**. Ces captchas utilisent des données géographiques pour offrir une alternative ludique, respectueuse de la vie privée et éducative.

Dans le cadre du projet de **développement informatique 2024-2025**, notre équipe est chargée d’**améliorer et optimiser l’interface d’administration** existante du GéoCaptcha. Actuellement, une API administrateur permet de gérer les jeux, les clés d’accès et d’accéder à diverses métriques. Cependant, l’interface actuelle présente des **contraintes d’ergonomie, de design et de fonctionnalités**. Une refonte est donc nécessaire pour offrir une **expérience utilisateur plus fluide et intuitive**.

---

## 📚 Documentation

📌 **Retrouvez la documentation complète ici :** [Documentation CaptchAdmin](https://github.com/MaelQllt/PDI14_GeoCaptcha/blob/main/doc/DOC%20DEV.md)

---

## 🚀 Installation et Lancement

### ✅ **Prérequis**

1. **Obtenir une clé d’accès** :
   - Une clé API et un identifiant sont nécessaires pour exploiter pleinement l’interface.
   - Ces informations doivent être renseignées dans un fichier **`.env`** dans le dossier `dev/frontend`.

```env
VITE_API_KEY=your_api_key
VITE_API_ID=your_api_id
```

2. **Installer Node.js et npm** :
   - Assurez-vous que **npm** est installé sur votre machine.
   - [Guide d’installation de npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

---

### 🔧 **Étapes d’installation**

Dans le terminal, **placez-vous dans le dossier `dev/frontend`**, puis exécutez les commandes suivantes :

1️⃣ **Installer les dépendances** :
```bash
npm install @gouvfr/dsfr vite ol @turf/turf axios
```

2️⃣ **Lancer le projet** :
```bash
npm run dev -- --host
```
> La commande `npm run dev -- --host` permet de lancer le serveur de développement en rendant l’interface accessible depuis d’autres appareils sur le réseau local. Cela est particulièrement utile pour tester l’application sur différents environnements.

3️⃣ **Accéder à l’interface** :
   - Copiez-collez dans un navigateur le lien **Network** affiché (ex. : `http://192.0.0.2:5176/`).

---

## 🎉 Profitez de CaptchAdmin !

Vous êtes maintenant prêt à utiliser **CaptchAdmin** et à découvrir une nouvelle manière de gérer les GéoCaptcha ! 🌎🔒


