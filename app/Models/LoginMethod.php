<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;

class LoginMethod extends Authenticatable
{
    use Notifiable;

    protected $table = 'login_methods';

    protected $fillable = [
        'user_id',
        'type_id',
        'value',
        'password',
        'is_active',
        'is_verified',
    ];

    protected $hidden = [
        'password',
    ];

    // Relation avec User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function type()
    {
        return $this->belongsTo(LoginMethodType::class, 'type_id');
    }

    // Vérifie le mot de passe
    public function checkPassword(string $plain)
    {
        return Hash::check($plain, $this->password);
    }
}