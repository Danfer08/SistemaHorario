<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Profesor;

class ProfesorSeeder extends Seeder
{
    public function run()
    {
        $profesores = [
            ['nombre' => 'Juan', 'apellido' => 'Perez', 'dni' => '12345678', 'correo' => 'juan.perez@example.com', 'estado' => 'activo'],
            ['nombre' => 'Maria', 'apellido' => 'Gomez', 'dni' => '87654321', 'correo' => 'maria.gomez@example.com', 'estado' => 'activo'],
            ['nombre' => 'Carlos', 'apellido' => 'Lopez', 'dni' => '11223344', 'correo' => 'carlos.lopez@example.com', 'estado' => 'activo'],
            ['nombre' => 'Ana', 'apellido' => 'Martinez', 'dni' => '44332211', 'correo' => 'ana.martinez@example.com', 'estado' => 'activo'],
            ['nombre' => 'Luis', 'apellido' => 'Rodriguez', 'dni' => '55667788', 'correo' => 'luis.rodriguez@example.com', 'estado' => 'activo'],
        ];

        foreach ($profesores as $prof) {
            Profesor::create($prof);
        }
    }
}
