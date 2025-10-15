<?php

namespace App\Http\Requests\Auth;

use App\Models\LoginMethod;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * L’utilisateur est toujours autorisé à tenter de se connecter.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation.
     */
    public function rules(): array
    {
        return [
            'value' => ['required', 'string', 'max:255'], // email ou téléphone
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Retourne la méthode de connexion (login_method) si elle existe.
     */
    public function getLoginMethod(): ?LoginMethod
    {
        return LoginMethod::where('value', $this->value)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Vérifie le rate limit avant la tentative.
     */
    public function ensureIsNotRateLimited(): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'value' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Clé de limitation (anti brute-force)
     */
    public function throttleKey(): string
    {
        return $this->string('value')
            ->lower()
            ->append('|'.$this->ip())
            ->transliterate()
            ->value();
    }
}
