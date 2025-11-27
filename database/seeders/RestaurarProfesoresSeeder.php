<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Profesor;

class RestaurarProfesoresSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Profesor::truncate();
        
        $profesores = [
            [1, 'Luis Honorato', 'Pita Astengo', '71248521', 'ejemplo1@gmail.com', NULL, 'ordinario', 'activo', 9],
            [2, 'Juan Manuel', 'Verme Insua', '75440821', 'ejemplo2@gmail.com', NULL, 'ordinario', 'activo', 10],
            [3, 'Angel Idelfonso', 'Catashunga Torres', '75938521', 'ejemplo3@gmail.com', NULL, 'ordinario', 'activo', 11],
            [4, 'Manuel', 'Tuesta Moreno', '75788521', 'ejemplo4@gmail.com', NULL, 'ordinario', 'activo', 12],
            [5, 'Carlos', 'Gonzales Aspajo', '75558521', 'ejemplo5@gmail.com', NULL, 'ordinario', 'activo', 13],
            [6, 'Saul', 'Flores Nunta', '75998521', 'ejemplo6@gmail.com', NULL, 'ordinario', 'activo', 14],
            [7, 'Angel Enrique', 'Lopez Rojas', '75208521', 'ejemplo7@gmail.com', NULL, 'ordinario', 'activo', 15],
            [8, 'Jose Edgar', 'Garcia Diaz', '75401521', 'ejemplo8@gmail.com', NULL, 'ordinario', 'activo', 16],
            [9, 'Rafael', 'Vilca Barbaran', '75448500', 'ejemplo9@gmail.com', NULL, 'ordinario', 'activo', 17],
            [10, 'Richard Alex', 'Lopez Albiño', '75008521', 'ejemplo10@gmail.com', NULL, 'ordinario', 'activo', 18],
            [11, 'Jimmy Max', 'Ramirez Villacorta', '71448521', 'ejemplo11@gmail.com', NULL, 'ordinario', 'activo', 19],
            [12, 'Tony Eduardo', 'Bardales Lozano', '72448521', 'ejemplo12@gmail.com', NULL, 'ordinario', 'activo', 20],
            [13, 'Francisco Miguel', 'Ruiz Hidalgo', '73448521', 'ejemplo13@gmail.com', NULL, 'ordinario', 'activo', 21],
            [14, 'Angel Alberto', 'Marthans Ruiz', '75458521', 'ejemplo14@gmail.com', NULL, 'ordinario', 'activo', 22],
            [15, 'Paul', 'Escobar Cardeña', '74448521', 'ejemplo15@gmail.com', NULL, 'ordinario', 'activo', 23],
            [16, 'Ronald Percy', 'Melchor Infantes', '75468521', 'ejemplo16@gmail.com', NULL, 'ordinario', 'activo', 24],
        ];

        foreach ($profesores as $p) {
            DB::table('profesor')->insert([
                'idProfesor' => $p[0],
                'nombre' => $p[1],
                'apellido' => $p[2],
                'dni' => $p[3],
                'correo' => $p[4],
                'telefono' => $p[5],
                'categoria' => $p[6],
                'estado' => $p[7],
                'FK_user_id' => $p[8],
            ]);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
