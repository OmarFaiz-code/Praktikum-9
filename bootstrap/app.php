<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Daftarkan alias 'role' agar bisa dipakai: ->middleware('role:admin')
        $middleware->alias([
            'role' => RoleMiddleware::class,
        ]);

        // Middleware Inertia (berisi shared props: auth.user, flash)
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Halaman 403 ditampilkan lewat Inertia untuk request halaman biasa.
        // Request fetch/AJAX (expectsJson) tetap menerima JSON 403 bawaan Laravel.
        $exceptions->respond(function ($response, Throwable $e, Request $request) {
            if (
                $e instanceof HttpExceptionInterface
                && $e->getStatusCode() === 403
                && ! $request->expectsJson()
            ) {
                return Inertia::render('error', [
                    'status'  => 403,
                    'message' => $e->getMessage() ?: 'Anda tidak memiliki hak akses ke halaman ini.',
                ])->toResponse($request)->setStatusCode(403);
            }

            return $response;
        });
    })->create();
