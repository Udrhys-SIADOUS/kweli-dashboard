<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Profile;
use App\Models\ProfileType;
use App\Models\LoginMethod;
use App\Models\LoginMethodType;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return Inertia::render('auth/register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'fullname' => 'required|string|max:255',
            'login_method_type' => 'required|string|in:email,phone,google,facebook,apple',
            'value' => 'required|string|max:255|unique:login_methods,value',
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()], // nul pour OAuth (google/facebook/github/apple)
            'profile_type_id' => 'nullable|exists:profile_types,id',
        ]);

        // Utilisation d'une transaction pour être sûr que tout passe ou rien
        DB::beginTransaction();

        try {
            // 1) Créer le user
            $user = User::create([
                'username' => 'kwl-' . strtoupper(substr(sha1($request->fullname . time()), 0, 6)),
                'password' => $request->password ? Hash::make($request->password) : null,
                'status_id' => 1, // actif par défaut
            ]);

            // 2) Créer le profile (avec datas JSON : nom + contact)
            $profileTypeId = $request->input('profile_type_id') 
                ?? ProfileType::where('name', 'personnel')->value('id');

            $profile = Profile::create([
                'user_id' => $user->id,
                'type_id' => $profileTypeId,
                'datas' => [
                    'fullname' => $request->fullname,
                    $request->login_method_type === 'phone' ? 'phone' : 'email' => $request->value,
                ],
                'show_personal_datas' => false,
                'status_id' => 1,
                'is_certified' => false,
            ]);

            // 3) Mettre à jour active_profile_id sur l'utilisateur
            $user->active_profile_id = $profile->id;
            $user->save();

            // 4) Récupérer / créer le LoginMethodType
            $loginType = LoginMethodType::firstOrCreate(
                ['name' => $request->login_method_type],
                ['description' => ucfirst($request->login_method_type) . ' login']
            );

            // 5) Créer la méthode de connexion
            $loginMethod = LoginMethod::create([
                'user_id' => $user->id,
                'type_id' => $loginType->id,
                'value' => $request->value,
                'password' => $request->password ? Hash::make($request->password) : null,
                'is_active' => true,
                'is_verified' => in_array($request->login_method_type, ['google','facebook','apple','github']) ? true : false,
            ]);

            DB::commit();
            event(new Registered($user));

            // 6) Cas : email → Fortify (MustVerifyEmail)
            if ($request->login_method_type === 'email') {
                /*// Attache l’email à l’utilisateur
                $user->forceFill([
                    'email' => $request->value,
                ])->save();*/

                return redirect()->route('verification.notice');
            }

            // 7) Cas : téléphone → OTP maison
            if ($request->login_method_type === 'phone') {
                $otp = rand(100000, 999999);

                /*DB::table('otps')->insert([
                    'login_method_id' => $loginMethod->id,
                    'code' => $otp,
                    'expires_at' => now()->addMinutes(10),
                    'created_at' => now(),
                ]);*/

                // Envoi via ton service SMS (Twilio)
                Log::info("📱 OTP envoyé à {$request->value} : $otp");

                //return redirect()->route('otp.verify', ['loginMethod' => $loginMethod->id]);
            }

            // 8) Cas : OAuth → connexion directe
            Auth::login($user);

            $request->session()->regenerate();

            return redirect()->intended(route('dashboard'));

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('❌ Erreur inscription', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
}
