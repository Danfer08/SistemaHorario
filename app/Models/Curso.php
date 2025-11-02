<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    protected $table = 'curso';
    protected $primaryKey = 'idCurso';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'descripcion',
        'tipo_curso',
        'horas_practica',
        'horas_teoria',
        'horas_totales',
        'ciclo'
    ];

    public function profesoresFijos()
    {
        return $this->belongsToMany(Profesor::class, 'cursoprofesorfijo', 'FK_idCurso', 'FK_idProfesor')
                    ->withPivot('estado');
    }

    public function horarioCursos()
    {
        return $this->hasMany(HorarioCurso::class, 'FK_idCurso');
    }
}