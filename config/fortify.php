<?php

use Laravel\Fortify\Features;

return [
    'guard' => 'web',
    'passwords' => 'users',
    'username' => 'email',
    'email' => 'email',
    'lowercase_usernames' => true,

    // Tujuan setelah login/register berhasil
    'home' => '/buku',

    'prefix' => '',
    'domain' => null,
    'middleware' => ['web'],

    'limiters' => [
        'login' => 'login',
    ],

    'views' => true,

    // Hanya fitur register, login, dan logout yang dipakai
    'features' => [
        Features::registration(),
    ],
];
