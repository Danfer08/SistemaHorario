<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetalleHorarioCurso extends Model
{
    protected $table = 'detalle_horario_curso';
    protected $primaryKey = 'idDetalle_Horario_Curso';
    public $timestamps = false;

    protected $fillable = [
        'FK_idHorarioCurso',
        'FK_idSalon',
        'dia',
        'Hora_inicio',
        'Hora_fin'
    ];

    public function horarioCurso()
    {
        return $this->belongsTo(HorarioCurso::class, 'FK_idHorarioCurso');
    }

    public function salon()
    {
        return $this->belongsTo(Salon::class, 'FK_idSalon');
    }
}