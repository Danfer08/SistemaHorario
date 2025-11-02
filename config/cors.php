<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Define qué orígenes (dominios/puertos) tienen permitido acceder a tu API.
    | Los orígenes deben ser explícitos (no usar '*') cuando 'supports_credentials' es true.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'],

    // Métodos permitidos
    'allowed_methods' => ['*'],

    // IMPORTANTE: Definir explícitamente los orígenes de tu frontend (React/Vite).
    // Estos deben coincidir con tu SANCTUM_STATEFUL_DOMAINS en .env
    'allowed_origins' => [
        'http://localhost:5173',  // Dominio/Puerto de Vite (típico)
        'http://127.0.0.1:5173', // Alternativa de localhost
        'http://localhost',       // Si accedes directamente a Laravel
        'http://127.0.0.1',       // Si accedes directamente a Laravel
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // ¡CRUCIAL! Debe ser true para que las cookies (Sanctum) funcionen.
    'supports_credentials' => true,

];
