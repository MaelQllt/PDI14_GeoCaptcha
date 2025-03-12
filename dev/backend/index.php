<?php
// Activer les erreurs pour le développement
declare(strict_types=1);
session_start();

//require_once 'flight/Flight.php';
// Inclure le fichier d'autoload de Composer pour charger les dépendances
require_once __DIR__ . '/vendor/autoload.php'; // Assure-toi que le chemin est correct

// Démarrer une session si nécessaire

// Définir les routes de ton API
Flight::route('GET /', function(){
    echo 'Bienvenue sur le GeoCaptcha Backend !';
});

// Inclure le fichier api.php pour gérer les routes API
require_once __DIR__ . '/src/api.php'; // Assure-toi que le chemin est correct

// Exemple de route pour récupérer des GeoCaptchas
Flight::route('GET /api/geocaptchas', function(){
    // Simuler des données pour l'exemple
    $data = [
        ["id" => 1, "question" => "Où se trouve la Tour Eiffel ?"],
        ["id" => 2, "question" => "Où se trouve le Colisée ?"]
    ];
    
    // Retourner les données en format JSON
    echo json_encode($data);
});

// Exemple de route pour ajouter un GeoCaptcha
Flight::route('POST /api/geocaptchas', function(){
    // Récupérer les données envoyées en POST (par exemple, une nouvelle question de captcha)
    $data = Flight::request()->data->getData();
    
    // Effectuer des actions, par exemple, enregistrer dans la base de données (simulé ici)
    // ...
    
    // Retourner une réponse
    echo json_encode(["message" => "GeoCaptcha créé avec succès", "data" => $data]);
});

// Démarrer Flight et écouter les requêtes
Flight::start();
