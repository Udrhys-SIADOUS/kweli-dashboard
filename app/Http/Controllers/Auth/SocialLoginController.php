<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LoginMethod;
use App\Models\LoginMethodType;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SocialLoginController extends Controller
{
    /**
     * Redirige vers le fournisseur OAuth (Google, Facebook, etc.)
     */
    public function redirect(string $provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    /**
     * Callback après authentification OAuth
     */
    public function callback(string $provider)
    {
        $socialUser = Socialite::driver($provider)->user();

        DB::beginTransaction();

        try {
            // 1) Récupère ou crée le type de login
            $loginType = LoginMethodType::firstOrCreate(
                ['name' => $provider],
                ['description' => ucfirst($provider) . ' login']
            );

            // 2) Vérifie si la méthode de connexion existe déjà
            $loginMethod = LoginMethod::where('value', $socialUser->getEmail())
                ->where('type_id', $loginType->id)
                ->first();

            if ($loginMethod) {
                $user = $loginMethod->user;
            } else {
                // 3) Crée l'utilisateur
                $user = User::create([
                    'username' => 'kwl-' . strtoupper(substr(sha1($socialUser->getName() . time()), 0, 6)),
                    'status_id' => 1,
                ]);

                // 4) Crée la login method OAuth
                $loginMethod = LoginMethod::create([
                    'user_id' => $user->id,
                    'type_id' => $loginType->id,
                    'value' => $socialUser->getEmail(),
                    'is_active' => true,
                    'is_verified' => true,
                    'datas' => [
                        'fullname' => $socialUser->getName() ?? $socialUser->getNickname(),
                        'avatar' => $socialUser->getAvatar(),
                        'email' => $socialUser->getEmail(),
                    ],
                ]);
            }

            // 5) Connexion
            Auth::login($user, true);

            $user->loadMissing(['status', 'activeProfile', 'loginMethods.type']); // relations utiles

            DB::commit();

            return redirect()->intended(route('dashboard'));
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Erreur Social Login', [
                'provider' => $provider,
                'error' => $e->getMessage()
            ]);
            return redirect()->route('login')->withErrors([
                'login' => 'Impossible de se connecter via ' . ucfirst($provider)
            ]);
        }
    }
}
