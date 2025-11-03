<?php

namespace App\Services;

use App\Models\DetalleHorarioCurso;
use App\Models\HorarioCurso;
use App\Models\Horario;
use App\Models\Profesor;
use App\Models\Curso;
use App\Models\Salon;
use Carbon\Carbon;

class HorarioValidationService
{
    private $horarioId;
    private $horario;

    public function __construct($horarioId = null)
    {
        if ($horarioId) {
            $this->horarioId = $horarioId;
            $this->horario = Horario::find($horarioId);
        }
    }

    /**
     * Valida si hay conflictos con el profesor en el mismo horario (mismo año y etapa)
     */
    public function validarConflictoProfesor($profesorId, $dia, $horaInicio, $horaFin, $horarioCursoId = null)
    {
        $detalles = DetalleHorarioCurso::whereHas('horarioCurso.horario', function ($query) {
            $query->where('idHorario', $this->horarioId);
        })->whereHas('horarioCurso', function ($query) use ($profesorId) {
            $query->where('FK_idProfesor', $profesorId);
        })->where('dia', $dia);

        if ($horarioCursoId) {
            $detalles->where('FK_idHorarioCurso', '!=', $horarioCursoId);
        }

        return $detalles->where(function ($query) use ($horaInicio, $horaFin) {
            $query->where(function ($q) use ($horaInicio, $horaFin) {
                $q->where('Hora_inicio', '<', $horaFin)
                  ->where('Hora_fin', '>', $horaInicio);
            });
        })->exists();
    }

    /**
     * Valida si hay conflictos con el salón en el mismo horario (mismo año y etapa)
     */
    public function validarConflictoSalon($salonId, $dia, $horaInicio, $horaFin, $detalleId = null)
    {
        $detalles = DetalleHorarioCurso::whereHas('horarioCurso.horario', function ($query) {
            $query->where('idHorario', $this->horarioId);
        })->where('FK_idSalon', $salonId)
          ->where('dia', $dia);

        if ($detalleId) {
            $detalles->where('idDetalle_Horario_Curso', '!=', $detalleId);
        }

        return $detalles->where(function ($query) use ($horaInicio, $horaFin) {
            $query->where(function ($q) use ($horaInicio, $horaFin) {
                $q->where('Hora_inicio', '<', $horaFin)
                  ->where('Hora_fin', '>', $horaInicio);
            });
        })->exists();
    }

    /**
     * Valida si hay conflictos con cursos del mismo ciclo (mismo año y etapa)
     */
    public function validarConflictoCiclo($ciclo, $dia, $horaInicio, $horaFin, $horarioCursoId = null)
    {
        $detalles = DetalleHorarioCurso::whereHas('horarioCurso.horario', function ($query) {
            $query->where('idHorario', $this->horarioId);
        })->whereHas('horarioCurso.curso', function ($query) use ($ciclo) {
            $query->where('ciclo', $ciclo);
        })->where('dia', $dia);

        if ($horarioCursoId) {
            $detalles->where('FK_idHorarioCurso', '!=', $horarioCursoId);
        }

        return $detalles->where(function ($query) use ($horaInicio, $horaFin) {
            $query->where(function ($q) use ($horaInicio, $horaFin) {
                $q->where('Hora_inicio', '<', $horaFin)
                  ->where('Hora_fin', '>', $horaInicio);
            });
        })->exists();
    }

    /**
     * Valida si el profesor excede su carga horaria máxima (en el mismo año y etapa)
     */
    public function validarCargaHorariaProfesor($profesorId, $horasAdicionales = 0)
    {
        $CARGA_MAXIMA = 40; // Definir la carga máxima permitida

        $horasActuales = DetalleHorarioCurso::whereHas('horarioCurso.horario', function ($query) {
            $query->where('idHorario', $this->horarioId);
        })->whereHas('horarioCurso', function ($query) use ($profesorId) {
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
     * Valida si hay superposición de grupos del mismo curso
     */
    public function validarConflictoMismoCurso($cursoId, $dia, $horaInicio, $horaFin, $horarioCursoId = null)
    {
        $detalles = DetalleHorarioCurso::whereHas('horarioCurso.horario', function ($query) {
            $query->where('idHorario', $this->horarioId);
        })->whereHas('horarioCurso', function ($query) use ($cursoId) {
            $query->where('FK_idCurso', $cursoId);
        })->where('dia', $dia);

        if ($horarioCursoId) {
            $detalles->where('FK_idHorarioCurso', '!=', $horarioCursoId);
        }

        return $detalles->where(function ($query) use ($horaInicio, $horaFin) {
            $query->where(function ($q) use ($horaInicio, $horaFin) {
                $q->where('Hora_inicio', '<', $horaFin)
                  ->where('Hora_fin', '>', $horaInicio);
            });
        })->exists();
    }

    /**
     * Valida todos los conflictos de horario para un año y etapa específicos
     */
    public function validarTodoConflictos($data)
    {
        if (!$this->horarioId) {
            throw new \Exception("Horario ID no especificado");
        }

        $conflictos = [];

        // Validar conflicto de profesor
        if ($this->validarConflictoProfesor(
            $data['FK_idProfesor'],
            $data['dia'],
            $data['Hora_inicio'],
            $data['Hora_fin'],
            $data['horarioCursoId'] ?? null
        )) {
            $profesor = Profesor::find($data['FK_idProfesor']);
            $conflictos[] = "El profesor {$profesor->nombre} ya tiene un curso asignado en este horario";
        }

        // Validar conflicto de salón
        if ($this->validarConflictoSalon(
            $data['FK_idSalon'],
            $data['dia'],
            $data['Hora_inicio'],
            $data['Hora_fin'],
            $data['detalleId'] ?? null
        )) {
            $salon = Salon::find($data['FK_idSalon']);
            $conflictos[] = "El salón {$salon->codigo} ya está ocupado en este horario";
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
            $conflictos[] = "Hay un conflicto con otro curso del ciclo {$curso->ciclo}";
        }

        // Validar conflicto de mismo curso (diferentes grupos)
        if ($this->validarConflictoMismoCurso(
            $data['FK_idCurso'],
            $data['dia'],
            $data['Hora_inicio'],
            $data['Hora_fin'],
            $data['horarioCursoId'] ?? null
        )) {
            $conflictos[] = "Hay un conflicto con otro grupo del mismo curso";
        }

        // Validar carga horaria del profesor
        $horasCurso = Carbon::parse($data['Hora_fin'])->diffInHours(Carbon::parse($data['Hora_inicio']));
        if (!$this->validarCargaHorariaProfesor($data['FK_idProfesor'], $horasCurso)) {
            $profesor = Profesor::find($data['FK_idProfesor']);
            $conflictos[] = "El profesor {$profesor->nombre} excedería su carga horaria máxima (40 horas)";
        }

        // Validar capacidad del salón
        if (!$this->validarCapacidadSalon($data['FK_idSalon'], $data['Nr_estudiantes'])) {
            $salon = Salon::find($data['FK_idSalon']);
            $conflictos[] = "El salón {$salon->codigo} (capacidad: {$salon->capacidad}) no tiene capacidad suficiente para {$data['Nr_estudiantes']} estudiantes";
        }

        return $conflictos;
    }

    /**
     * Valida todos los conflictos existentes en un horario completo
     */
    public function validarConflictosHorarioCompleto()
    {
        if (!$this->horarioId) {
            throw new \Exception("Horario ID no especificado");
        }

        $conflictos = [];
        $detalles = DetalleHorarioCurso::whereHas('horarioCurso.horario', function ($query) {
            $query->where('idHorario', $this->horarioId);
        })->with(['horarioCurso.profesor', 'horarioCurso.curso', 'salon'])->get();

        foreach ($detalles as $detalle) {
            $data = [
                'FK_idProfesor' => $detalle->horarioCurso->FK_idProfesor,
                'FK_idSalon' => $detalle->FK_idSalon,
                'FK_idCurso' => $detalle->horarioCurso->FK_idCurso,
                'dia' => $detalle->dia,
                'Hora_inicio' => $detalle->Hora_inicio,
                'Hora_fin' => $detalle->Hora_fin,
                'Nr_estudiantes' => $detalle->horarioCurso->Nr_estudiantes,
                'horarioCursoId' => $detalle->FK_idHorarioCurso,
                'detalleId' => $detalle->idDetalle_Horario_Curso
            ];

            $conflictosDetalle = $this->validarTodoConflictos($data);
            
            foreach ($conflictosDetalle as $conflicto) {
                $conflictos[] = [
                    'mensaje' => $conflicto,
                    'detalle' => $detalle,
                    'curso' => $detalle->horarioCurso->curso->nombre,
                    'profesor' => $detalle->horarioCurso->profesor->nombre,
                    'salon' => $detalle->salon->codigo,
                    'dia' => $detalle->dia,
                    'horario' => $detalle->Hora_inicio . ' - ' . $detalle->Hora_fin
                ];
            }
        }

        return $conflictos;
    }
}