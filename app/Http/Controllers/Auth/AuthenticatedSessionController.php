<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\LoginMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class AuthenticatedSessionController extends Controller
{
    /**
     * Page de connexion.
     */
    public function create(Request $request)
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Traitement de la connexion.
     */
    public function store(LoginRequest $request)
    {
        $request->validate([
            'login_method_type' => 'required|string|in:email,phone,google,facebook,apple',
            'value' => 'required|string|max:255',
            'password' => 'required|string',
        ]);

        // Trouver la méthode de connexion active
        $loginMethod = LoginMethod::whereHas('type', function ($q) use ($request) {
            $q->where('name', $request->login_method_type);
        })
            ->where('value', $request->value)
            ->where('is_active', true)
            ->first();

        if (! $loginMethod || ! $loginMethod->password || ! Hash::check($request->password, $loginMethod->password)) {
            return back()->withErrors([
                'value' => __('auth.failed'),
            ]);
        }

        $user = $loginMethod->user;

        if (! $user) {
            return back()->withErrors([
                'value' => __('auth.failed'),
            ]);
        }

        if ($user->status && $user->status->name !== 'active') {
            return back()->withErrors([
                'value' => __('Votre compte est ' . $user->status->name . '.'),
            ]);
        }

        /*// Si téléphone → OTP
        if ($loginMethod->type->name === 'phone') {
            // générer OTP, rediriger vers page OTP
        }

        // Si email non vérifié → rediriger vers Fortify email verification
        if ($loginMethod->type->name === 'email' && ! $loginMethod->is_verified) {
            return redirect()->route('verification.notice');
        }

        if (Features::enabled(Features::twoFactorAuthentication()) && $user->hasEnabledTwoFactorAuthentication()) {
            $request->session()->put([
                'login.id' => $user->getKey(),
                'login.remember' => $request->boolean('remember'),
            ]);

            return to_route('two-factor.login');
        }*/

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        // 🔥 Redirige vers le dashboard avec données utilisateur
        return redirect()->route('dashboard')->with([
            //'user' => $this->formatUser($user),
            'message' => 'Connexion réussie',
        ]);
    }

    /**
     * Déconnexion.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Formatage des données utilisateur pour Inertia
     */
    private function formatUser($user): array
    {
        $user->loadMissing(['status', 'activeProfile.type', 'loginMethods.type']);

        return [
            'id' => $user->id,
            'username' => $user->username,
            //'email' => $user->loginMethods->firstWhere('type.name', 'email')->value ?? null,
            //'phone' => $user->loginMethods->firstWhere('type.name', 'phone')->value ?? null,
            'avatar' => $user->activeProfile->datas['avatar'] ?? null,
            'status' => $user->status?->name,
            'profile' => [
                'id' => $user->activeProfile->id ?? null,
                'type' => $user->activeProfile->type->name ?? null,
                'is_certified' => $user->activeProfile->is_certified ?? false,
                'datas' => $user->activeProfile->datas ?? [],
            ],
            'methods' => $user->loginMethods->map(function ($method) {
                return [
                    'type' => $method->type->name ?? null,
                    'value' => $method->value,
                    'is_active' => $method->is_active,
                ];
            }),
        ];
    }
}
