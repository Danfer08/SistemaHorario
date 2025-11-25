<?php

namespace App\Http\Controllers;

use App\Models\Salon;
use App\Models\DetalleHorarioCurso;
use Illuminate\Http\Request;

class SalonController extends Controller
{
    public function index()
    {
        $salones = Salon::all();
        return response()->json(['data' => $salones]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tipo' => 'required|in:laboratorio,normal',
            'capacidad' => 'required|integer|min:1',
            'disponibilidad' => 'required|in:habilitado,deshabilitado',
            'equipamiento' => 'nullable|array'
        ]);

        $salon = Salon::create($request->all());
        return response()->json(['data' => $salon], 201);
    }

    public function update(Request $request, $id)
    {
        $salon = Salon::findOrFail($id);
        
        $request->validate([
            'tipo' => 'required|in:laboratorio,normal',
            'capacidad' => 'required|integer|min:1',
            'disponibilidad' => 'required|in:habilitado,deshabilitado',
            'equipamiento' => 'nullable|array'
        ]);

        $salon->update($request->all());
        return response()->json(['data' => $salon]);
    }

    public function destroy($id)
    {
        $salon = Salon::findOrFail($id);

        if ($salon->disponibilidad === 'habilitado') {
            $salon->disponibilidad = 'deshabilitado';
            $salon->save();
            return response()->json(['message' => 'Salón deshabilitado exitosamente']);
        } else {
            // Si ya está deshabilitado, intentamos eliminarlo físicamente
            try {
                $salon->delete();
                return response()->json(['message' => 'Salón eliminado permanentemente']);
            } catch (\Illuminate\Database\QueryException $e) {
                // Error de integridad referencial (FK)
                if ($e->getCode() == 23000) {
                    return response()->json([
                        'message' => 'No se puede eliminar el salón porque tiene horarios asignados. Solo se mantendrá deshabilitado.'
                    ], 409); // 409 Conflict
                }
                throw $e;
            }
        }
    }

    public function disponibles()
    {
        $salones = Salon::where('disponibilidad', 'habilitado')
            ->get()
            ->map(function ($s) {
                $s->codigo = 'SL-' . $s->idSalon; // para UI
                return $s;
            });
        return response()->json(['data' => $salones]);
    }


    public function horarioSalones()
    {
        try {
            $salones = Salon::where('disponibilidad', 'habilitado')->get();
            $resultado = [];
            
            foreach ($salones as $salon) {
                // Obtener detalles de horario solo para horarios CONFIRMADOS
                $detallesHorario = DetalleHorarioCurso::where('FK_idSalon', $salon->idSalon)
                    ->whereHas('horarioCurso.horario', function($query) {
                        $query->where('estado', 'confirmado'); // ✅ VERIFICAR ESTADO AQUÍ
                    })
                    ->with(['horarioCurso.curso', 'horarioCurso.profesor', 'horarioCurso.horario'])
                    ->get()
                    ->groupBy(function($detalle) {
                        $horario = $detalle->horarioCurso->horario;
                        return $horario->año . '-' . $horario->etapa;
                    });
                
                $resultado[] = [
                    'salon' => [
                        'id' => $salon->idSalon,
                        'codigo' => $salon->codigo,
                        'capacidad' => $salon->capacidad,
                        'tipo' => $salon->tipo
                    ],
                    'horarios_por_semestre' => $detallesHorario
                ];
            }
            
            return response()->json(['data' => $resultado]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al cargar horarios'], 500);
        }
    }


}