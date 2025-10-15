<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoginMethodType extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    public function loginMethods() {
        return $this->hasMany(LoginMethod::class, 'type_id');
    }
}
