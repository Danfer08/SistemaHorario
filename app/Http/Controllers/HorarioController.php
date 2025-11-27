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
use App\Models\Profesor;
use App\Models\Salon;

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
                             ->where('estado', 'confirmado')
                             ->exists();
            if ($exists) {
                return response()->json(['message' => 'Ya existe un horario confirmado del mismo período.'], 422);
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

    public function eliminarHorario($id)
    {
        try {
            DB::beginTransaction();

            $horario = Horario::findOrFail($id);

            // Obtener IDs para eliminación eficiente
            $horarioCursoIds = HorarioCurso::where('FK_idHorario', $id)
                ->pluck('idHorarioCurso');

            // Eliminar en lote
            DetalleHorarioCurso::whereIn('FK_idHorarioCurso', $horarioCursoIds)->delete();
            HorarioCurso::where('FK_idHorario', $id)->delete();
            $horario->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Horario eliminado con éxito'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el horario'
            ], 500);
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
                'tipo' => $payload['tipo'] ?? 'regular',
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

    public function eliminarSesion(Request $request, $id)
    {
        $request->validate([
            'detalle_id' => 'required|exists:detalle_horario_curso,idDetalle_Horario_Curso'
        ]);

        try {
            DB::beginTransaction();

            $detalle = DetalleHorarioCurso::findOrFail($request->detalle_id);
            $horarioCursoId = $detalle->FK_idHorarioCurso;
            
            // Eliminar el detalle (sesión específica)
            $detalle->delete();

            // Verificar si quedan más detalles para este grupo
            $restantes = DetalleHorarioCurso::where('FK_idHorarioCurso', $horarioCursoId)->count();

            if ($restantes === 0) {
                // Si no quedan sesiones, eliminar también el grupo (HorarioCurso)
                HorarioCurso::where('idHorarioCurso', $horarioCursoId)->delete();
            }

            DB::commit();
            return response()->json(['message' => 'Sesión eliminada correctamente']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al eliminar la sesión', 'error' => $e->getMessage()], 500);
        }
    }

    public function actualizarAsignacion(Request $request, $id)
    {
        $request->validate([
            'horario_curso_id' => 'required|exists:horario_curso,idHorarioCurso',
            'profesor_id' => 'required|exists:profesor,idProfesor'
        ]);

        try {
            DB::beginTransaction();

            $horarioCurso = HorarioCurso::findOrFail($request->horario_curso_id);
            $detalles = DetalleHorarioCurso::where('FK_idHorarioCurso', $horarioCurso->idHorarioCurso)->get();
            
            // Validar conflictos para el nuevo profesor en todas las sesiones del grupo
            $validationService = new HorarioValidationService($id);
            
            foreach ($detalles as $detalle) {
                if ($validationService->validarConflictoProfesor(
                    $request->profesor_id, 
                    $detalle->dia, 
                    $detalle->Hora_inicio, 
                    $detalle->Hora_fin
                )) {
                    return response()->json(['message' => "El profesor seleccionado tiene conflictos de horario en {$detalle->dia} {$detalle->Hora_inicio}"], 422);
                }
            }

            // Actualizar profesor
            $horarioCurso->FK_idProfesor = $request->profesor_id;
            $horarioCurso->save();

            DB::commit();
            
            return response()->json(['message' => 'Profesor actualizado con éxito']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al actualizar asignación', 'error' => $e->getMessage()], 500);
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
                      $qq->where(function($query) use ($ciclo) {
                          $query->whereHas('curso', function ($qc) use ($ciclo) {
                              $qc->where('ciclo', $ciclo);
                          })
                          ->orWhere('tipo', 'irregular');
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

    public function generarAutomatico($id)
    {
        set_time_limit(300); // 5 minutos
        
        try {
            DB::beginTransaction();

            $horario = Horario::findOrFail($id);
            $validationService = new \App\Services\HorarioValidationService($id);
            
            // 1. Determinar cursos requeridos (Solo obligatorios/regulares)
            $ciclos = $horario->etapa === 'I' ? [1, 3, 5, 7, 9] : [2, 4, 6, 8, 10];
            $cursos = Curso::whereIn('ciclo', $ciclos)
                          ->where('tipo_curso', 'obligatorio')
                          ->orderBy('horas_totales', 'desc') // Priorizar cursos largos
                          ->orderBy('ciclo', 'asc')
                          ->get();
            
            // 2. Obtener recursos
            $salonesTodos = Salon::where('disponibilidad', 'habilitado')->get();
            $profesoresTodos = Profesor::where('estado', 'activo')->get();
            
            // 3. Cargar estado actual del horario en memoria para evitar N+1 queries
            $ocupacionSalones = []; // [salon_id][dia][hora] = true
            $ocupacionProfesores = []; // [profesor_id][dia][hora] = true
            $ocupacionCiclos = []; // [ciclo][dia][hora] = true
            
            $detallesExistentes = DetalleHorarioCurso::whereHas('horarioCurso', function($q) use ($id) {
                $q->where('FK_idHorario', $id);
            })->with(['horarioCurso.curso'])->get();

            foreach ($detallesExistentes as $detalle) {
                $dia = $detalle->dia;
                $inicio = (int)substr($detalle->Hora_inicio, 0, 2);
                $fin = (int)substr($detalle->Hora_fin, 0, 2);
                
                for ($h = $inicio; $h < $fin; $h++) {
                    $ocupacionSalones[$detalle->FK_idSalon][$dia][$h] = true;
                    $ocupacionProfesores[$detalle->horarioCurso->FK_idProfesor][$dia][$h] = true;
                    $ocupacionCiclos[$detalle->horarioCurso->curso->ciclo][$dia][$h] = true;
                }
            }

            $asignados = 0;
            $errores = [];

            foreach ($cursos as $curso) {
                // Verificar si ya está asignado
                $yaAsignado = HorarioCurso::where('FK_idHorario', $id)
                    ->where('FK_idCurso', $curso->idCurso)
                    ->exists();
                
                if ($yaAsignado) continue;

                $horasTeoria = $curso->horas_teoria;
                $horasPractica = $curso->horas_practica;
                $totalHoras = $horasTeoria + $horasPractica;

                if ($totalHoras == 0) continue;

                // Definir las sesiones necesarias
                $sesionesRequeridas = [];
                if ($horasTeoria > 0) {
                    $sesionesRequeridas[] = ['tipo' => 'Teoría', 'horas' => $horasTeoria];
                }
                if ($horasPractica > 0) {
                    $sesionesRequeridas[] = ['tipo' => 'Práctica', 'horas' => $horasPractica];
                }

                // Si solo hay una sesión (ej: solo teoría), tratarla normal
                // Si hay dos, intentar asignarlas en días diferentes
                
                $asignado = false;
                $salones = $salonesTodos->where('capacidad', '>=', 30)->values();
                $dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

                // Estrategia: Iterar Profesores -> Buscar slots para TODAS las sesiones
                foreach ($profesoresTodos as $profesor) {
                    if ($asignado) break;

                    // Intentar encontrar slots para las sesiones requeridas con este profesor
                    $slotsEncontrados = []; // Almacenará [dia, horaInicio, horaFin, salonId] para cada sesión
                    $diasUsados = []; // Para evitar repetir días si hay múltiples sesiones

                    foreach ($sesionesRequeridas as $index => $sesion) {
                        $horas = $sesion['horas'];
                        $slotEncontradoParaSesion = false;

                        // Buscar slot
                        foreach ($dias as $dia) {
                            if ($slotEncontradoParaSesion) break;
                            
                            // Preferencia: Días diferentes para sesiones diferentes
                            if (in_array($dia, $diasUsados)) continue; 

                            for ($hora = 7; $hora <= (22 - $horas); $hora++) {
                                if ($slotEncontradoParaSesion) break;

                                // Validar Ciclo (Memoria)
                                $conflictoCiclo = false;
                                for ($h = $hora; $h < ($hora + $horas); $h++) {
                                    if (isset($ocupacionCiclos[$curso->ciclo][$dia][$h])) {
                                        $conflictoCiclo = true;
                                        break;
                                    }
                                }
                                if ($conflictoCiclo) continue;

                                // Validar Profesor (Memoria)
                                $conflictoProfesor = false;
                                for ($h = $hora; $h < ($hora + $horas); $h++) {
                                    if (isset($ocupacionProfesores[$profesor->idProfesor][$dia][$h])) {
                                        $conflictoProfesor = true;
                                        break;
                                    }
                                }
                                if ($conflictoProfesor) continue;

                                // Buscar Salón
                                foreach ($salones as $salon) {
                                    // Validar Salón (Memoria)
                                    $conflictoSalon = false;
                                    for ($h = $hora; $h < ($hora + $horas); $h++) {
                                        if (isset($ocupacionSalones[$salon->idSalon][$dia][$h])) {
                                            $conflictoSalon = true;
                                            break;
                                        }
                                    }
                                    if ($conflictoSalon) continue;

                                    // ¡Slot Válido Encontrado!
                                    $slotsEncontrados[] = [
                                        'dia' => $dia,
                                        'hora' => $hora,
                                        'horas' => $horas,
                                        'salon' => $salon
                                    ];
                                    $diasUsados[] = $dia;
                                    $slotEncontradoParaSesion = true;
                                    break; // Break salones
                                }
                            }
                        }
                        
                        // Si no encontramos slot para esta sesión (respetando días diferentes),
                        // intentar relajar la restricción de días diferentes (si es la 2da sesión)
                        if (!$slotEncontradoParaSesion && count($diasUsados) > 0) {
                             // Reintentar sin la restricción "continue if in_array($dia, $diasUsados)"
                             // (Lógica simplificada: si falla estricto, fallamos profesor. 
                             //  Podríamos hacer backtracking pero es costoso. 
                             //  Asumiremos que si no hay en otro día, pasamos al siguiente profesor).
                        }
                    }

                    // Verificar si encontramos slots para TODAS las sesiones requeridas
                    if (count($slotsEncontrados) === count($sesionesRequeridas)) {
                        // ¡Éxito! Asignar todo
                        $horarioCurso = HorarioCurso::create([
                            'FK_idHorario' => $id,
                            'FK_idCurso' => $curso->idCurso,
                            'FK_idProfesor' => $profesor->idProfesor,
                            'Grupo' => '1',
                            'tipo' => 'regular',
                            'Nr_estudiantes' => 30
                        ]);

                        foreach ($slotsEncontrados as $slot) {
                            $horaInicio = sprintf('%02d:00:00', $slot['hora']);
                            $horaFin = sprintf('%02d:00:00', $slot['hora'] + $slot['horas']);

                            DetalleHorarioCurso::create([
                                'FK_idHorarioCurso' => $horarioCurso->idHorarioCurso,
                                'FK_idSalon' => $slot['salon']->idSalon,
                                'dia' => $slot['dia'],
                                'Hora_inicio' => $horaInicio,
                                'Hora_fin' => $horaFin
                            ]);

                            // Actualizar Memoria
                            for ($h = $slot['hora']; $h < ($slot['hora'] + $slot['horas']); $h++) {
                                $ocupacionSalones[$slot['salon']->idSalon][$slot['dia']][$h] = true;
                                $ocupacionProfesores[$profesor->idProfesor][$slot['dia']][$h] = true;
                                $ocupacionCiclos[$curso->ciclo][$slot['dia']][$h] = true;
                            }
                        }

                        $asignado = true;
                        $asignados++;
                    }
                }
                
                if (!$asignado) {
                    $errores[] = "No se pudo asignar el curso {$curso->nombre} (Ciclo {$curso->ciclo})";
                }
            }

            DB::commit();

            return response()->json([
                'message' => "Proceso completado. Se asignaron {$asignados} cursos.",
                'errores' => $errores
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error en generación automática: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno en generación automática', 'error' => $e->getMessage()], 500);
        }
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