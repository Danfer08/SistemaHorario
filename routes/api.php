<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HorarioController;
use App\Http\Controllers\ProfesorController;
use App\Http\Controllers\SalonController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RolController;
use App\Models\Curso;


// Rutas públicas de autenticación
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas (requieren autenticación)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Rutas para la gestión de horarios
    Route::prefix('horarios')->group(function () {
        Route::get('/', [HorarioController::class, 'index']);
        Route::post('/', [HorarioController::class, 'crearHorario']);
        Route::post('/{id}/asignar-curso', [HorarioController::class, 'asignarCurso']);
        Route::post('/{id}/confirmar', [HorarioController::class, 'confirmarHorario']);
        Route::get('/profesor/{profesorId}', [HorarioController::class, 'getHorarioProfesor']);
        Route::get('/ciclo/{ciclo}', [HorarioController::class, 'getHorarioCiclo']);
        Route::get('/{id}', [HorarioController::class, 'show']);
        Route::delete('/{id}', [HorarioController::class, 'eliminarHorario']);

        // Endpoints usados por el front actual
        Route::get('/{id}/grid', [HorarioController::class, 'grid']);
        Route::post('/{id}/asignar-curso', [HorarioController::class, 'asignarCurso']);
        Route::delete('/{id}/eliminar-asignacion', [HorarioController::class, 'eliminarAsignacion']);
        Route::delete('/{id}/eliminar-sesion', [HorarioController::class, 'eliminarSesion']);
        Route::get('/{id}/validar-conflictos', [HorarioController::class, 'validarConflictosHorario']);
        Route::post('/{id}/publicar', [HorarioController::class, 'publicar']);
        Route::post('/{id}/generar-automatico', [HorarioController::class, 'generarAutomatico']);
        Route::post('/{id}/actualizar-asignacion', [HorarioController::class, 'actualizarAsignacion']);
    });

    //Roles
    Route::prefix('roles')->group(function () {
        Route::get('/', [RolController::class, 'index']);
        Route::post('/', [RolController::class, 'store']);
        Route::get('/permisos', [RolController::class, 'getPermissions']);
        Route::put('/{id}', [RolController::class, 'update']);
        Route::delete('/{id}', [RolController::class, 'destroy']);
    });

    // Rutas para la gestión de usuarios

    Route::prefix('usuarios')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });




    // Rutas para la gestión de profesores
    Route::prefix('profesores')->group(function () {
        Route::get('/', [ProfesorController::class, 'index']);
        Route::post('/', [ProfesorController::class, 'store']);
        Route::post('/disponibilidad', [ProfesorController::class, 'guardarDisponibilidad']);
        Route::put('/{id}', [ProfesorController::class, 'update']);
        Route::delete('/{id}', [ProfesorController::class, 'destroy']);
        Route::get('/horariosprofesor/{id}', [ProfesorController::class, 'mostrarHorarios']);
    });

    // Rutas para la gestión de salones
    Route::prefix('salones')->group(function () {
        Route::get('/', [SalonController::class, 'index']);
        Route::post('/', [SalonController::class, 'store']);
        Route::put('/{id}', [SalonController::class, 'update']);
        Route::delete('/{id}', [SalonController::class, 'destroy']);
        Route::get('/horariosalon', [SalonController::class, 'horarioSalones']);
    });

    // Salones disponibles (forma consumida por el front)
    Route::get('/salones-disponibles', [SalonController::class, 'disponibles']);
});

// Cursos por ciclo para el front
Route::middleware('auth:sanctum')->get('/cursos/ciclo/{ciclo}', function ($ciclo) {
    $cursos = Curso::where('ciclo', (string) $ciclo)->get();
    return response()->json(['data' => $cursos]);
});

// Cursos irregulares (ciclo opuesto)
Route::middleware('auth:sanctum')->get('/cursos/irregulares/{ciclo}', function ($ciclo) {
    $cicloNum = (int) $ciclo;
    $esPar = $cicloNum % 2 === 0;

    // Si es par, buscamos impares. Si es impar, buscamos pares.
    // Ciclos: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

    $query = Curso::query();

    if ($esPar) {
        // Es par (2, 4...), traer impares (1, 3, 5, 7, 9)
        $query->whereIn('ciclo', ['1', '3', '5', '7', '9']);
    } else {
        // Es impar (1, 3...), traer pares (2, 4, 6, 8, 10)
        $query->whereIn('ciclo', ['2', '4', '6', '8', '10']);
    }

    $cursos = $query->get();
    return response()->json(['data' => $cursos]);
});

// Listado general de cursos + estadísticas
Route::middleware('auth:sanctum')->get('/cursos', function () {
    $cursos = Curso::all();
    $stats = [
        'total' => $cursos->count(),
        'obligatorios' => $cursos->where('tipo_curso', 'obligatorio')->count(),
        'electivos' => $cursos->where('tipo_curso', 'electivo')->count(),
        'total_horas' => $cursos->sum(function ($c) {
            return (int) ($c->horas_totales ?? 0);
        })
    ];
    return response()->json(['data' => $cursos, 'stats' => $stats]);
});

// CRUD mínimo de cursos para la UI
Route::middleware('auth:sanctum')->post('/cursos', function (\Illuminate\Http\Request $request) {
    $validated = $request->validate([
        'nombre' => 'required|string|max:120',
        'ciclo' => 'required|in:1,2,3,4,5,6,7,8,9,10',
        'tipo_curso' => 'required|in:electivo,obligatorio',
        'horas_practica' => 'nullable|integer|min:0',
        'horas_teoria' => 'nullable|integer|min:0',
        'horas_totales' => 'nullable|integer|min:0',
        'descripcion' => 'nullable|string',
    ]);
    $curso = Curso::create($validated);
    return response()->json(['status' => 'success', 'data' => $curso], 201);
});

Route::middleware('auth:sanctum')->put('/cursos/{id}', function (\Illuminate\Http\Request $request, $id) {
    $curso = Curso::findOrFail($id);
    $validated = $request->validate([
        'nombre' => 'sometimes|required|string|max:120',
        'ciclo' => 'sometimes|required|in:1,2,3,4,5,6,7,8,9,10',
        'tipo_curso' => 'sometimes|required|in:electivo,obligatorio',
        'horas_practica' => 'nullable|integer|min:0',
        'horas_teoria' => 'nullable|integer|min:0',
        'horas_totales' => 'nullable|integer|min:0',
        'descripcion' => 'nullable|string',
    ]);
    $curso->update($validated);
    return response()->json(['status' => 'success', 'data' => $curso]);
});

Route::middleware('auth:sanctum')->delete('/cursos/{id}', function ($id) {
    $curso = Curso::findOrFail($id);
    $curso->delete();
    return response()->json(['status' => 'success']);
});

