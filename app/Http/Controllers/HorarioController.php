<?php

namespace App\Http\Controllers;

use App\Models\Horario;
use App\Models\HorarioCurso;
use App\Models\DetalleHorarioCurso;
use App\Services\HorarioValidationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HorarioController extends Controller
{
    protected $validationService;
    public function __construct(HorarioValidationService $validationService)
    {
        $this->validationService = $validationService;
    }

    public function index(Request $request)
    {
        try {
            $query = Horario::with(['horarioCursos.curso', 'horarioCursos.profesor', 'horarioCursos.detalles.salon'])
                ->orderBy('año', 'desc')
                ->orderBy('etapa', 'desc');

            if ($request->filled('año')) {
                $query->where('año', $request->input('año'));
            }
            if ($request->filled('etapa')) {
                $query->where('etapa', $request->input('etapa'));
            }
            if ($request->filled('estado')) {
                $query->where('estado', $request->input('estado'));
            }

            $horarios = $query->get();

            return response()->json([
                'data' => $horarios,
                'message' => 'Horarios recuperados exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al recuperar los horarios',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $horario = Horario::with(['horarioCursos.curso', 'horarioCursos.profesor', 'horarioCursos.detalles.salon'])
                ->findOrFail($id);

            return response()->json([
                'data' => $horario,
                'message' => 'Horario recuperado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Horario no encontrado', 'error' => $e->getMessage()], 404);
        }
    }

    public function crearHorario(Request $request)
    {
        $request->validate([
            'año' => 'required|integer',
            'etapa' => 'required|in:I,II',
        ]);

        try {
            DB::beginTransaction();

            // Evitar duplicados en estado borrador
            $exists = Horario::where('año', $request->año)
                             ->where('etapa', $request->etapa)
                             ->where('estado', 'borrador')
                             ->exists();
            if ($exists) {
                return response()->json(['message' => 'Ya existe un horario en borrador para este período.'], 422);
            }

            $horario = Horario::create([
                'año' => $request->año,
                'etapa' => $request->etapa,
                'fecha' => now(),
                'estado' => 'borrador'
            ]);

            DB::commit();
            return response()->json(['message' => 'Horario creado con éxito', 'data' => $horario], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al crear el horario', 'error' => $e->getMessage()], 500);
        }
    }

    public function asignarCurso(Request $request)
    {
        $request->validate([
            'curso_id' => 'required|exists:curso,idCurso',
            'profesor_id' => 'required|exists:profesor,idProfesor',
            'grupo' => 'required|in:1,2,3',
            'estudiantes' => 'required|integer|min:1',
            'detalles' => 'required|array|min:1',
            'detalles.*.dia' => 'required|in:Lunes,Martes,Miércoles,Jueves,Viernes,Sábado',
            'detalles.*.hora_inicio' => 'required|date_format:H:i',
            'detalles.*.hora_fin' => 'required|date_format:H:i|after:detalles.*.hora_inicio',
            'detalles.*.salon_id' => 'required|exists:salon,idSalon',
        ]);

        try {
            $payload = $request->all();
            $detallePayload = $payload['detalles'][0]; // Asumimos una sesión por asignación desde el modal

            $dataValidacion = [
                'FK_idProfesor' => $payload['profesor_id'],
                'FK_idCurso' => $payload['curso_id'],
                'FK_idSalon' => $detallePayload['salon_id'],
                'dia' => $detallePayload['dia'],
                'Hora_inicio' => $detallePayload['hora_inicio'] . ':00',
                'Hora_fin' => $detallePayload['hora_fin'] . ':00',
                'Nr_estudiantes' => $payload['estudiantes'],
            ];

            // Validar conflictos
            $conflictos = $this->validationService->validarTodoConflictos($dataValidacion);
            if (!empty($conflictos)) {
                return response()->json(['message' => 'Conflictos detectados', 'conflictos' => $conflictos], 422);
            }

            DB::beginTransaction();

            $horarioCurso = HorarioCurso::create([
                'FK_idHorario' => (int)$request->route('id'),
                'FK_idProfesor' => $payload['profesor_id'],
                'FK_idCurso' => $payload['curso_id'],
                'tipo' => $payload['tipo'] ?? 'regular', // 'regular' por defecto
                'Grupo' => $payload['grupo'],
                'Nr_estudiantes' => $payload['estudiantes']
            ]);

            $detalleCreado = DetalleHorarioCurso::create([
                'FK_idHorarioCurso' => $horarioCurso->idHorarioCurso,
                'FK_idSalon' => $detallePayload['salon_id'],
                'dia' => $detallePayload['dia'],
                'Hora_inicio' => $dataValidacion['Hora_inicio'],
                'Hora_fin' => $dataValidacion['Hora_fin']
            ]);

            DB::commit();
            return response()->json([
                'message' => 'Curso asignado con éxito',
                'data' => [
                    'horarioCurso' => $horarioCurso,
                    'detalle' => $detalleCreado
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al asignar el curso', 'error' => $e->getMessage()], 500);
        }
    }
    public function confirmarHorario($id)
    {
        try {
            $horario = Horario::findOrFail($id);
            
            if ($horario->estado !== 'borrador') {
                return response()->json(['message' => 'El horario no está en estado borrador'], 422);
            }

            $horario->estado = 'confirmado';
            $horario->save();

            return response()->json(['message' => 'Horario confirmado con éxito']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al confirmar el horario', 'error' => $e->getMessage()], 500);
        }
    }

    public function getHorarioProfesor($profesorId)
    {
        try {
            $horarios = HorarioCurso::where('FK_idProfesor', $profesorId)
                ->with(['curso', 'detalles.salon'])
                ->whereHas('horario', function($q) {
                    $q->where('estado', 'confirmado');
                })
                ->get();

            return response()->json(['horarios' => $horarios]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al obtener el horario', 'error' => $e->getMessage()], 500);
        }
    }

    public function getHorarioCiclo($ciclo)
    {
        try {
            $horarios = HorarioCurso::whereHas('curso', function($q) use ($ciclo) {
                $q->where('ciclo', $ciclo);
            })
            ->with(['curso', 'profesor', 'detalles.salon'])
            ->whereHas('horario', function($q) {
                $q->where('estado', 'confirmado');
            })
            ->get();

            return response()->json(['horarios' => $horarios]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al obtener el horario', 'error' => $e->getMessage()], 500);
        }
    }

    public function grid($id, Request $request)
    {
        $ciclo = $request->input('ciclo');
        $items = DetalleHorarioCurso::whereHas('horarioCurso', function ($q) use ($id, $ciclo) {
                $q->where('FK_idHorario', $id)
                  ->when($ciclo, function ($qq) use ($ciclo) {
                      $qq->whereHas('curso', function ($qc) use ($ciclo) {
                          $qc->where('ciclo', $ciclo);
                      });
                  });
            })
            ->with(['horarioCurso.curso', 'horarioCurso.profesor', 'salon'])
            ->get()
            ->map(function ($d) {
                return [
                    'id' => $d->horarioCurso->idHorarioCurso,
                    'curso' => $d->horarioCurso->curso->nombre,
                    'profesor' => optional($d->horarioCurso->profesor)->nombre . ' ' . optional($d->horarioCurso->profesor)->apellido,
                    'profesor_id' => optional($d->horarioCurso->profesor)->idProfesor,
                    'salon' => 'SL-' . $d->salon->idSalon,
                    'salon_id' => $d->salon->idSalon,
                    'grupo' => $d->horarioCurso->Grupo,
                    'estudiantes' => $d->horarioCurso->Nr_estudiantes,
                    'dia' => $d->dia,
                    'hora' => substr($d->Hora_inicio, 0, 5) . '-' . substr($d->Hora_fin, 0, 5),
                ];
            });

        return response()->json(['data' => $items]);
    }

    public function eliminarAsignacion($id, Request $request)
    {
        $request->validate([
            'horario_curso_id' => 'required|exists:horario_curso,idHorarioCurso'
        ]);

        try {
            DB::beginTransaction();
            DetalleHorarioCurso::where('FK_idHorarioCurso', $request->horario_curso_id)->delete();
            HorarioCurso::where('idHorarioCurso', $request->horario_curso_id)->delete();
            DB::commit();
            return response()->json(['message' => 'Asignación eliminada']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al eliminar asignación', 'error' => $e->getMessage()], 500);
        }
    }

    public function validarConflictosHorario($id)
    {
        $conflictos = [];
        $detalles = DetalleHorarioCurso::whereHas('horarioCurso', function ($q) use ($id) {
                $q->where('FK_idHorario', $id);
            })
            ->with(['horarioCurso.curso'])
            ->get();

        foreach ($detalles as $detalle) {
            $data = [
                'FK_idProfesor' => $detalle->horarioCurso->FK_idProfesor,
                'FK_idCurso' => $detalle->horarioCurso->FK_idCurso,
                'FK_idSalon' => $detalle->FK_idSalon,
                'dia' => $detalle->dia,
                'Hora_inicio' => $detalle->Hora_inicio,
                'Hora_fin' => $detalle->Hora_fin,
                'Nr_estudiantes' => $detalle->horarioCurso->Nr_estudiantes,
                'horarioCursoId' => $detalle->horarioCurso->idHorarioCurso,
                'detalleId' => $detalle->idDetalle_Horario_Curso,
            ];
            $result = $this->validationService->validarTodoConflictos($data);
            foreach ($result as $msg) {
                $conflictos[] = [
                    'mensaje' => $msg,
                    'curso' => $detalle->horarioCurso->curso->nombre,
                    'dia' => $detalle->dia,
                    'hora_inicio' => $detalle->Hora_inicio,
                    'hora_fin' => $detalle->Hora_fin,
                ];
            }
        }

        return response()->json(['data' => $conflictos]);
    }

    public function publicar($id)
    {
        $conf = $this->validarConflictosHorario($id)->getData(true);
        if (!empty($conf['data'])) {
            return response()->json(['message' => 'No se puede publicar', 'conflictos' => $conf['data']], 422);
        }

        $horario = Horario::findOrFail($id);
        $horario->estado = 'confirmado';
        $horario->save();
        return response()->json(['message' => 'Horario publicado']);
    }
}