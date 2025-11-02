<?php

namespace App\Http\Controllers;

use App\Models\Salon;
use Illuminate\Http\Request;

class SalonController extends Controller
{
    public function index()
    {
        $salones = Salon::where('disponibilidad', 'habilitado')->get();
        return response()->json(['data' => $salones]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tipo' => 'required|in:laboratorio,normal',
            'capacidad' => 'required|integer|min:1',
            'disponibilidad' => 'required|in:habilitado,deshabilitado'
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
            'disponibilidad' => 'required|in:habilitado,deshabilitado'
        ]);

        $salon->update($request->all());
        return response()->json(['data' => $salon]);
    }

    public function destroy($id)
    {
        $salon = Salon::findOrFail($id);
        $salon->disponibilidad = 'deshabilitado';
        $salon->save();
        return response()->json(['message' => 'Salón deshabilitado']);
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
}