<?php
Flight::route('GET /geocaptchas', function() {
    echo json_encode(["message" => "Liste des GeoCaptchas"]);
});

Flight::route('POST /geocaptchas', function() {
    $data = Flight::request()->data;
    echo json_encode(["message" => "GeoCaptcha créé", "data" => $data]);
});
