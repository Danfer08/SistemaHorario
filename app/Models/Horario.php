<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Horario extends Model
{
    protected $table = 'horario';
    protected $primaryKey = 'idHorario';
    public $timestamps = false;

    protected $fillable = [
        'año',
        'etapa',
        'fecha',
        'estado'
    ];

    public function horarioCursos()
    {
        return $this->hasMany(HorarioCurso::class, 'FK_idHorario');
    }
}