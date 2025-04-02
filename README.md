# CaptchAdmin



## Pourquoi CaptchAdmin ?

Lorsque vous arrivez sur un site internet, il vous est souvent demandé si vous êtes un
humain ou un robot. Pour prouver votre humanité vous devez résoudre un captcha, la plupart du temps sous la forme de déchiffrage de texte ou bien de séquence
d’images. L’IGN, par la Mission Architecture Réseau et Sécurité (MARS), a conçu un
système novateur dans ce domaine, les GéoCaptcha. Ces captchas reposent
sur des données géographiques, l’objectif est de proposer aux utilisateurs un nouveau type
de captcha qui se veut ludique et respectueux de la vie privée tout en sensibilisant le public
à la donnée géospatiale.

Dans le contexte du projet de développement informatique pour 2024-2025, notre
équipe est chargée d’améliorer et d’optimiser l’interface d’administration déjà existante
du GéoCaptcha. À l’heure actuelle, une API administrateur offre la possibilité de gérer les
jeux, les clés d’accès et d’accéder à diverses métriques. Toutefois, l’interface liée présente
des contraintes en matière d’ergonomie, de design et de fonctionnalités. Pour assurer une
expérience utilisateur plus aisée et intuitive avec de nouvelles fonctionnalités, une refonte
de l’interface est donc demandée par l’IGN.


## Documentation 

La documentation complète est disponible ici (https://github.com/MaelQllt/PDI14_GeoCaptcha/blob/main/doc/DOC%20DEV.md). 


## Pour le lancer rapidement

Tout d'abord pour exploiter pleinement l'interface il faut une clé d'accès à l'API GeoCaptcha de l'IGN. 
La suite n'est alors utile qu'en possession d'une clé et d'un id qu'il faut mettre dans un fichier `.env` dans le dossier `dev/frontend`.


```js

VITE_API_KEY= 
VITE_API_ID= 

```


Ensuite vérifiez que npm est installé sur votre machine. (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Dans le terminale au dossier `dev/frontend` lancez la commande :

```bash
npm install @gouvfr/dsfr
```

Puis 

```bash
npm install vite
```

Puis 

```
npm install ol
```

Puis

```
npm install @turf/turf
```

Puis

```
npm install axios
```

Ensuite 

```bash
npm run dev -- --host
```

Enfin, copiez-collez dans un navigateur le lien Network renvoyé. Exemple : http://192.0.0.2:5176/


Vous pouvez maintenant profiter de CaptchAdmin.