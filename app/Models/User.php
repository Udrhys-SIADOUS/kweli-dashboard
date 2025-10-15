<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username', 
        'password', 
        'status_id', 
        'active_profile_id'
    ];


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            //'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function status() {
        return $this->belongsTo(UserStatus::class, 'status_id');
    }

    public function profiles() {
        return $this->hasMany(Profile::class);
    }

    public function activeProfile() {
        return $this->belongsTo(Profile::class, 'active_profile_id');
    }

    public function loginMethods() {
        return $this->hasMany(LoginMethod::class);
    }

    public function getAllDetails()
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'status' => $this->status?->name,
            'avatar' => $this->activeProfile?->datas['avatar'] ?? null,
            'email' => $this->loginMethods()
                ->whereHas('type', fn($q) => $q->where('name', 'email'))
                ->first()?->value,
            'phone' => $this->loginMethods()
                ->whereHas('type', fn($q) => $q->where('name', 'phone'))
                ->first()?->value,
            'profile' => [
                'type' => $this->activeProfile?->type?->name,
                'datas' => $this->activeProfile?->datas,
                'is_certified' => $this->activeProfile?->is_certified,
            ],
        ];
    }

}
