<?php

use Illuminate\Support\Facades\Route;

// Route login/register/logout disediakan oleh Fortify (lihat FortifyServiceProvider
// dan config/fortify.php), jadi tidak perlu ditulis manual di sini.
Route::redirect('/', '/buku');

// Route Buku, Peminjaman, dan UserManagement ada di
// Modules/{NamaModul}/routes/web.php (dimuat otomatis oleh nwidart/laravel-modules).
