<?php

namespace App\Services;

use App\Models\DetalleHorarioCurso;
use App\Models\HorarioCurso;
use App\Models\Profesor;
use App\Models\Curso;
use App\Models\Salon;
use Carbon\Carbon;

class HorarioValidationService
{
    /**
     * Valida si hay conflictos con el profesor en el mismo horario
     */
    public function validarConflictoProfesor($profesorId, $dia, $horaInicio, $horaFin, $horarioCursoId = null)
    {
        $detalles = DetalleHorarioCurso::whereHas('horarioCurso', function ($query) use ($profesorId) {
            $query->where('FK_idProfesor', $profesorId);
        })->where('dia', $dia);

        if ($horarioCursoId) {
            $detalles->whereNot('FK_idHorarioCurso', $horarioCursoId);
        }

        return $detalles->where(function ($query) use ($horaInicio, $horaFin) {
            $query->where(function ($q) use ($horaInicio, $horaFin) {
                $q->where('Hora_inicio', '<=', $horaInicio)
                  ->where('Hora_fin', '>', $horaInicio);
            })->orWhere(function ($q) use ($horaInicio, $horaFin) {
                $q->where('Hora_inicio', '<', $horaFin)
                  ->where('Hora_fin', '>=', $horaFin);
            });
        })->exists();
    }

    /**
     * Valida si hay conflictos con el salón en el mismo horario
     */
    public function validarConflictoSalon($salonId, $dia, $horaInicio, $horaFin, $detalleId = null)
    {
        $detalles = DetalleHorarioCurso::where('FK_idSalon', $salonId)
            ->where('dia', $dia);

        if ($detalleId) {
            $detalles->where('idDetalle_Horario_Curso', '!=', $detalleId);
        }

        return $detalles->where(function ($query) use ($horaInicio, $horaFin) {
            $query->where(function ($q) use ($horaInicio, $horaFin) {
                $q->where('Hora_inicio', '<=', $horaInicio)
                  ->where('Hora_fin', '>', $horaInicio);
            })->orWhere(function ($q) use ($horaInicio, $horaFin) {
                $q->where('Hora_inicio', '<', $horaFin)
                  ->where('Hora_fin', '>=', $horaFin);
            });
        })->exists();
    }

    /**
     * Valida si hay conflictos con cursos del mismo ciclo
     */
    public function validarConflictoCiclo($ciclo, $dia, $horaInicio, $horaFin, $horarioCursoId = null)
    {
        $detalles = DetalleHorarioCurso::whereHas('horarioCurso.curso', function ($query) use ($ciclo) {
            $query->where('ciclo', $ciclo);
        })->where('dia', $dia);

        if ($horarioCursoId) {
            $detalles->whereNot('FK_idHorarioCurso', $horarioCursoId);
        }

        return $detalles->where(function ($query) use ($horaInicio, $horaFin) {
            $query->where(function ($q) use ($horaInicio, $horaFin) {
                $q->where('Hora_inicio', '<=', $horaInicio)
                  ->where('Hora_fin', '>', $horaInicio);
            })->orWhere(function ($q) use ($horaInicio, $horaFin) {
                $q->where('Hora_inicio', '<', $horaFin)
                  ->where('Hora_fin', '>=', $horaFin);
            });
        })->exists();
    }

    /**
     * Valida si el profesor excede su carga horaria máxima
     */
    public function validarCargaHorariaProfesor($profesorId, $horasAdicionales = 0)
    {
        $CARGA_MAXIMA = 40; // Definir la carga máxima permitida

        $horasActuales = DetalleHorarioCurso::whereHas('horarioCurso', function ($query) use ($profesorId) {
            $query->where('FK_idProfesor', $profesorId);
        })->get()->sum(function ($detalle) {
            $inicio = Carbon::parse($detalle->Hora_inicio);
            $fin = Carbon::parse($detalle->Hora_fin);
            return $fin->diffInHours($inicio);
        });

        return ($horasActuales + $horasAdicionales) <= $CARGA_MAXIMA;
    }

    /**
     * Valida si el salón tiene capacidad suficiente
     */
    public function validarCapacidadSalon($salonId, $numeroEstudiantes)
    {
        $salon = Salon::find($salonId);
        return $salon && $salon->capacidad >= $numeroEstudiantes;
    }

    /**
     * Valida todos los conflictos de horario
     */
    public function validarTodoConflictos($data)
    {
        $conflictos = [];

        // Validar conflicto de profesor
        if ($this->validarConflictoProfesor(
            $data['FK_idProfesor'],
            $data['dia'],
            $data['Hora_inicio'],
            $data['Hora_fin'],
            $data['horarioCursoId'] ?? null
        )) {
            $conflictos[] = "El profesor ya tiene un curso asignado en este horario";
        }

        // Validar conflicto de salón
        if ($this->validarConflictoSalon(
            $data['FK_idSalon'],
            $data['dia'],
            $data['Hora_inicio'],
            $data['Hora_fin'],
            $data['detalleId'] ?? null
        )) {
            $conflictos[] = "El salón ya está ocupado en este horario";
        }

        // Validar conflicto de ciclo
        $curso = Curso::find($data['FK_idCurso']);
        if ($this->validarConflictoCiclo(
            $curso->ciclo,
            $data['dia'],
            $data['Hora_inicio'],
            $data['Hora_fin'],
            $data['horarioCursoId'] ?? null
        )) {
            $conflictos[] = "Hay un conflicto con otro curso del mismo ciclo";
        }

        // Validar carga horaria del profesor
        if (!$this->validarCargaHorariaProfesor(
            $data['FK_idProfesor'],
            Carbon::parse($data['Hora_fin'])->diffInHours(Carbon::parse($data['Hora_inicio']))
        )) {
            $conflictos[] = "El profesor excedería su carga horaria máxima";
        }

        // Validar capacidad del salón
        if (!$this->validarCapacidadSalon($data['FK_idSalon'], $data['Nr_estudiantes'])) {
            $conflictos[] = "El salón no tiene capacidad suficiente";
        }

        return $conflictos;
    }
}