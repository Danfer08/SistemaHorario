<?php

namespace App\Http\Controllers;

use App\Models\Horario;
use App\Models\HorarioCurso;
use App\Models\DetalleHorarioCurso;
use App\Services\HorarioValidationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Curso;

class HorarioController extends Controller
{
    // Remover la inyección del constructor - lo inicializaremos cuando sea necesario
    
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
        Log::info("ControllerAsignarCurso: Iniciado");
        $request->validate([
            'horario_id' => 'required|exists:horario,idHorario',
            'curso_id' => 'required|exists:curso,idCurso',
            'profesor_id' => 'required|exists:profesor,idProfesor',
            'grupo' => 'required|in:1,2,3',
            'estudiantes' => 'required|integer|min:1',
            'dia' => 'required|in:Lunes,Martes,Miércoles,Jueves,Viernes,Sábado',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
            'salon_id' => 'required|exists:salon,idSalon',
        ]);

        try {
            $payload = $request->all();
            
            Log::info("ControllerAsignarCurso: Validar conflictos para la sesión");
            
            // CORRECCIÓN: Inicializar el servicio con el horario_id
            $validationService = new HorarioValidationService($payload['horario_id']);
            
            $dataValidacion = [
                'FK_idProfesor' => $payload['profesor_id'],
                'FK_idCurso' => $payload['curso_id'],
                'FK_idSalon' => $payload['salon_id'],
                'dia' => $payload['dia'],
                'Hora_inicio' => $payload['hora_inicio'] . ':00',
                'Hora_fin' => $payload['hora_fin'] . ':00',
                'Nr_estudiantes' => $payload['estudiantes'],
                // Agregar estos campos para exclusiones
                'horarioCursoId' => null, // Será null para nuevas asignaciones
                'detalleId' => null, // Será null para nuevos detalles
            ];

            $conflictos = $validationService->validarTodoConflictos($dataValidacion);

            if (!empty($conflictos)) {
                return response()->json(['message' => 'Conflictos detectados', 'conflictos' => $conflictos], 422);
            }

            DB::beginTransaction();

            // Buscar o crear el HorarioCurso (Grupo)
            $horarioCurso = HorarioCurso::firstOrCreate(
                [
                    'FK_idHorario' => $payload['horario_id'],
                    'FK_idCurso' => $payload['curso_id'],
                    'Grupo' => $payload['grupo'],
                ],
                [
                    'FK_idProfesor' => $payload['profesor_id'],
                    'tipo' => $payload['tipo'] ?? 'regular',
                    'Nr_estudiantes' => $payload['estudiantes']
                ]
            );

            Log::info("HorarioCurso (Grupo) encontrado o creado con ID: " . $horarioCurso->idHorarioCurso);

            // Crear el DetalleHorarioCurso (Sesión)
            $detalleCreado = DetalleHorarioCurso::create([
                'FK_idHorarioCurso' => $horarioCurso->idHorarioCurso,
                'FK_idSalon' => $payload['salon_id'],
                'dia' => $payload['dia'],
                'Hora_inicio' => $payload['hora_inicio'] . ':00',
                'Hora_fin' => $payload['hora_fin'] . ':00'
            ]);

            Log::info("DetalleHorarioCurso (Sesión) creado con ID: " . $detalleCreado->idDetalle_Horario_Curso);

            DB::commit();
            return response()->json([
                'message' => 'Sesión del curso asignada con éxito',
                'data' => [
                    'horarioCurso' => $horarioCurso,
                    'detalle' => $detalleCreado
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al asignar la sesión del curso', 'error' => $e->getMessage()], 500);
        }
    }

    public function eliminarAsignacion(Request $request, $id)
    {
        Log::info("ControlEliminacionAsignacion: Inicio");

        $request->validate([
            'horario_curso_id' => 'required|exists:horario_curso,idHorarioCurso'
        ]);

        Log::info("ControlEliminacionAsignacion: Pasado validación");

        try {
            DB::beginTransaction();
            
            Log::info("ControlEliminacionAsignacion: Begin transaction");

            DetalleHorarioCurso::where('FK_idHorarioCurso', $request->horario_curso_id)->delete();
            // Eliminar el grupo de curso
            HorarioCurso::where('idHorarioCurso', $request->horario_curso_id)->delete();
            DB::commit();
            return response()->json(['message' => 'Asignación de grupo completa eliminada']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al eliminar asignación', 'error' => $e->getMessage()], 500);
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
                    'id' => $d->idDetalle_Horario_Curso, // ID del detalle
                    'horario_curso_id' => $d->horarioCurso->idHorarioCurso, // ID de la asignación padre
                    'curso' => $d->horarioCurso->curso->nombre,
                    'curso_id' => $d->horarioCurso->curso->idCurso,
                    'profesor' => optional($d->horarioCurso->profesor)->nombre . ' ' . optional($d->horarioCurso->profesor)->apellido,
                    'profesor_id' => optional($d->horarioCurso->profesor)->idProfesor,
                    'salon' => $d->salon->codigo,
                    'salon_id' => $d->salon->idSalon,
                    'grupo' => $d->horarioCurso->Grupo,
                    'estudiantes' => $d->horarioCurso->Nr_estudiantes,
                    'dia' => $d->dia,
                    'hora' => substr($d->Hora_inicio, 0, 5),
                    'hora_fin' => substr($d->Hora_fin, 0, 5)
                ];
            });

        return response()->json(['data' => $items]);
    }

    public function validarConflictosHorario($id)
    {
        // CORRECCIÓN: Inicializar el servicio con el ID del horario
        $validationService = new HorarioValidationService($id);
        $conflictos = $validationService->validarConflictosHorarioCompleto();

        return response()->json(['data' => $conflictos]);
    }

    public function publicar($id)
    {
        // Primero validar conflictos
        $conf = $this->validarConflictosHorario($id)->getData(true);
        if (!empty($conf['data'])) {
            return response()->json([
                'message' => 'No se puede publicar el horario porque tiene conflictos',
                'conflictos' => $conf['data']
            ], 422);
        }

        // Luego validar que el horario esté completo
        $validacionCompleto = $this->validacionHorarioCompleto($id);
        if (!$validacionCompleto['completo']) {
            return response()->json([
                'message' => 'No se puede publicar el horario porque está incompleto',
                'faltantes' => $validacionCompleto['faltantes'],
                'cursos_faltantes' => $validacionCompleto['cursos_faltantes']
            ], 422);
        }

        $horario = Horario::findOrFail($id);
        $horario->estado = 'confirmado';
        $horario->save();

        return response()->json(['message' => 'Horario publicado exitosamente']);
    }

    public function validacionHorarioCompleto($id)
    {
        $horario = Horario::findOrFail($id);
        $horario_cursos = HorarioCurso::where('FK_idHorario', $id)
            ->with(['detalles', 'curso'])
            ->get();

        // Determinar ciclos requeridos según la etapa
        $ciclosRequeridos = $horario->etapa === 'I' ? [1, 3, 5, 7, 9] : [2, 4, 6, 8, 10];

        // Obtener todos los cursos obligatorios para los ciclos requeridos
        $cursosObligatoriosRequeridos = Curso::whereIn('ciclo', $ciclosRequeridos)
            ->where('tipo_curso', 'obligatorio')
            ->get();

        // Identificar cursos irregulares asignados (para excluirlos de la validación)
        $cursosIrregularesAsignados = $horario_cursos
            ->where('tipo', 'irregular')
            ->pluck('FK_idCurso')
            ->toArray();

        // Filtrar cursos obligatorios requeridos excluyendo los que son irregulares
        $cursosObligatoriosValidar = $cursosObligatoriosRequeridos->filter(function($curso) use ($cursosIrregularesAsignados) {
            return !in_array($curso->idCurso, $cursosIrregularesAsignados);
        });

        // Obtener cursos obligatorios que SÍ están asignados en el horario
        $cursosObligatoriosAsignados = $horario_cursos
            ->where('curso.tipo_curso', 'obligatorio')
            ->pluck('FK_idCurso')
            ->toArray();

        // Identificar cursos obligatorios faltantes
        $cursosFaltantes = $cursosObligatoriosValidar->filter(function($curso) use ($cursosObligatoriosAsignados) {
            return !in_array($curso->idCurso, $cursosObligatoriosAsignados);
        });

        // Validar que cada curso asignado tenga al menos un detalle (sesión horaria)
        $cursosSinDetalles = $horario_cursos->filter(function($horario_curso) {
            return $horario_curso->detalles->isEmpty();
        });

        // Preparar respuesta
        $completo = $cursosFaltantes->isEmpty() && $cursosSinDetalles->isEmpty();

        $faltantes = [];
        if (!$cursosSinDetalles->isEmpty()) {
            $faltantes[] = "Hay cursos asignados sin sesiones horarias: " . 
                $cursosSinDetalles->pluck('curso.nombre')->implode(', ');
        }

        $cursosFaltantesNombres = $cursosFaltantes->pluck('nombre')->toArray();

        return [
            'completo' => $completo,
            'faltantes' => $faltantes,
            'cursos_faltantes' => $cursosFaltantesNombres,
            'total_cursos_obligatorios' => $cursosObligatoriosValidar->count(),
            'cursos_obligatorios_asignados' => count($cursosObligatoriosAsignados),
            'cursos_obligatorios_faltantes' => $cursosFaltantes->count(),
            'cursos_sin_detalles' => $cursosSinDetalles->count()
        ];
    }

    public function estadoValidacionHorario($id)
    {
        $validacion = $this->validacionHorarioCompleto($id);
        
        return response()->json([
            'completo' => $validacion['completo'],
            'detalles' => [
                'total_cursos_obligatorios' => $validacion['total_cursos_obligatorios'],
                'cursos_obligatorios_asignados' => $validacion['cursos_obligatorios_asignados'],
                'cursos_obligatorios_faltantes' => $validacion['cursos_obligatorios_faltantes'],
                'cursos_sin_detalles' => $validacion['cursos_sin_detalles']
            ],
            'faltantes' => $validacion['faltantes'],
            'cursos_faltantes' => $validacion['cursos_faltantes']
        ]);
    }
}