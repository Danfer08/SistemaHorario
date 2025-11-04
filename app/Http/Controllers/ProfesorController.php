<?php

namespace App\Http\Controllers;

use App\Models\Profesor;
use App\Models\Horario;
use App\Models\HorarioCurso;
use App\Models\DetalleHorarioCurso;
use Illuminate\Http\Request;

class ProfesorController extends Controller
{
    public function index()
    {
        $profesores = Profesor::all();
        return response()->json(['data' => $profesores]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'dni' => 'required|string|size:8|unique:profesor,dni',
            'correo' => 'required|email|max:100|unique:profesor,correo'
        ]);

        $profesor = Profesor::create($request->all());
        return response()->json(['status' => 'success', 'data' => $profesor], 201);
    }

    public function guardarDisponibilidad(Request $request)
    {
        $request->validate([
            'disponibilidad' => 'required|array'
        ]);

        // Aquí implementarías la lógica para guardar la disponibilidad
        // del profesor en la base de datos

        return response()->json(['message' => 'Disponibilidad guardada con éxito']);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'sometimes|required|string|max:100',
            'apellido' => 'sometimes|required|string|max:100',
            'dni' => 'sometimes|required|string|size:8|unique:profesor,dni,' . $id . ',idProfesor',
            'correo' => 'sometimes|required|email|max:100|unique:profesor,correo,' . $id . ',idProfesor'
        ]);

        $profesor = Profesor::findOrFail($id);
        $profesor->update($request->all());
        return response()->json(['status' => 'success', 'data' => $profesor]);
    }

    public function destroy($id)
    {
        $profesor = Profesor::findOrFail($id);
        $profesor->delete();
        return response()->json(['status' => 'success']);
    }

    
    public function mostrarHorarios($id)
    {
            try {
                $profesor = Profesor::findOrFail($id);

                // Obtener horarios donde el profesor tiene cursos asignados
                $horarios = Horario::where('estado','confirmado')->whereHas('horarioCursos', function($query) use ($id) {
                    $query->where('FK_idProfesor', $id);
                })
                ->with(['horarioCursos' => function($query) use ($id) {
                    $query->where('FK_idProfesor', $id)
                        ->with(['curso', 'detalles']);
                }])
                ->get();

                return response()->json(['data' => $horarios]);

            } catch (\Exception $e) {
                return response()->json(['error' => 'Profesor no encontrado'], 404);
            }
    }

}