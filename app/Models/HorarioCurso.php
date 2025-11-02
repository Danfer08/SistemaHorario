<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HorarioCurso extends Model
{
    protected $table = 'horario_curso';
    protected $primaryKey = 'idHorarioCurso';
    public $timestamps = false;

    protected $fillable = [
        'FK_idProfesor',
        'FK_idCurso',
        'tipo',
        'FK_idHorario',
        'Grupo',
        'Nr_estudiantes'
    ];

    public function profesor()
    {
        return $this->belongsTo(Profesor::class, 'FK_idProfesor');
    }

    public function curso()
    {
        return $this->belongsTo(Curso::class, 'FK_idCurso');
    }

    public function horario()
    {
        return $this->belongsTo(Horario::class, 'FK_idHorario');
    }

    public function detalles()
    {
        return $this->hasMany(DetalleHorarioCurso::class, 'FK_idHorarioCurso');
    }
}