<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Logika register memakai action milik kita (role default = user)
        Fortify::createUsersUsing(CreateNewUser::class);

        // Tampilan login & register dirender oleh React lewat Inertia
        Fortify::loginView(fn () => Inertia::render('auth/login'));
        Fortify::registerView(fn () => Inertia::render('auth/register'));

        // Setelah login/register Fortify mengarah ke config('fortify.home') = /buku

        RateLimiter::for('login', function (Request $request) {
            $key = strtolower($request->input(Fortify::username())).'|'.$request->ip();

            return Limit::perMinute(5)->by($key);
        });
    }
}
