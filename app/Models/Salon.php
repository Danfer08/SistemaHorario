<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Salon extends Model
{
    protected $table = 'salon';
    protected $primaryKey = 'idSalon';
    public $timestamps = false;

    protected $fillable = [
        'tipo',
        'capacidad',
        'disponibilidad'
    ];

    public function detallesHorarioCurso()
    {
        return $this->hasMany(DetalleHorarioCurso::class, 'FK_idSalon');
    }
}