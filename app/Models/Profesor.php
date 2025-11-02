<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profesor extends Model
{
    protected $table = 'profesor';
    protected $primaryKey = 'idProfesor';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'apellido',
        'dni',
        'correo',
        'FK_user_id'
    ];

    public function cursosFijos()
    {
        return $this->belongsToMany(Curso::class, 'cursoprofesorfijo', 'FK_idProfesor', 'FK_idCurso')
                    ->withPivot('estado');
    }

    public function horarioCursos()
    {
        return $this->hasMany(HorarioCurso::class, 'FK_idProfesor');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'FK_user_id');
    }
}