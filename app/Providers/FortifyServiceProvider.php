<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Laravel\Fortify\Fortify;
use App\Models\User;
use App\Models\LoginMethod;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));
        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        // 🔹 Authentification multi-login
        Fortify::authenticateUsing(function ($request) {
            $login = $request->input('login');
            $password = $request->input('password');
    
            $method = LoginMethod::where('value', $login)
                ->where('is_active', true)
                ->first();
    
            if (! $method || ! $method->is_verified) {
                throw ValidationException::withMessages([
                    'login' => ['Cette méthode de connexion est invalide ou non vérifiée.'],
                ]);
            }
    
            if (! Hash::check($password, $method->password)) {
                throw ValidationException::withMessages([
                    'password' => ['Mot de passe incorrect.'],
                ]);
            }
    
            return $method;
        });
    }
}
