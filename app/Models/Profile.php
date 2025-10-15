<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'type_id', 'datas', 'show_personal_datas', 'status_id', 'is_certified'
    ];

    protected $casts = [
        'datas' => 'array',
        'show_personal_datas' => 'boolean',
        'is_certified' => 'boolean',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function type() {
        return $this->belongsTo(ProfileType::class, 'type_id');
    }

    public function status() {
        return $this->belongsTo(UserStatus::class, 'status_id');
    }
}
