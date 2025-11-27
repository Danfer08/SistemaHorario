<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use App\Models\User;
use App\Models\Horario;
use App\Models\Curso;
use App\Models\Profesor;
use App\Models\Salon;
use App\Models\HorarioCurso;
use App\Models\DetalleHorarioCurso;

class SafeWorkloadTest extends TestCase
{
    use DatabaseTransactions;

    public function test_respeta_carga_horaria_con_fracciones()
    {
        $user = User::create(['name' => 'U', 'email' => 'test_' . uniqid() . '@t.com', 'password' => bcrypt('p')]);
        $this->actingAs($user);

        $horario = Horario::create(['año' => '2025', 'etapa' => 'I', 'estado' => 'borrador']);
        $salon = Salon::create(['codigo' => 'S1', 'capacidad' => 50, 'tipo' => 'normal', 'disponibilidad' => 'habilitado', 'pabellon' => 'A', 'piso' => '1']);
        
        // Crear un profesor específico para la prueba
        $profesor = Profesor::create(['nombre' => 'ProfTest', 'apellido' => 'CargaFull', 'dni' => '999999', 'correo' => 'full@test.com', 'estado' => 'activo']);

        // Asignar carga manual de 39.5 horas
        $cursoCarga = Curso::create([
            'nombre' => 'Carga Dummy', 'ciclo' => '1', 'tipo_curso' => 'obligatorio',
            'horas_teoria' => 40, 'horas_practica' => 0, 'horas_totales' => 40, 'creditos' => 10
        ]);

        $hc = HorarioCurso::create([
            'FK_idHorario' => $horario->idHorario,
            'FK_idCurso' => $cursoCarga->idCurso,
            'FK_idProfesor' => $profesor->idProfesor,
            'Grupo' => '1', 'tipo' => 'regular', 'Nr_estudiantes' => 30
        ]);
        
        // Detalles que suman 39.5 horas
        DetalleHorarioCurso::create(['FK_idHorarioCurso' => $hc->idHorarioCurso, 'FK_idSalon' => $salon->idSalon, 'dia' => 'Lunes', 'Hora_inicio' => '07:00:00', 'Hora_fin' => '22:00:00']); // 15h
        DetalleHorarioCurso::create(['FK_idHorarioCurso' => $hc->idHorarioCurso, 'FK_idSalon' => $salon->idSalon, 'dia' => 'Martes', 'Hora_inicio' => '07:00:00', 'Hora_fin' => '22:00:00']); // 15h
        DetalleHorarioCurso::create(['FK_idHorarioCurso' => $hc->idHorarioCurso, 'FK_idSalon' => $salon->idSalon, 'dia' => 'Miércoles', 'Hora_inicio' => '07:00:00', 'Hora_fin' => '16:30:00']); // 9.5h

        // Intentar asignar curso de 1 hora. 39.5 + 1 = 40.5 > 40.
        $cursoNuevo = Curso::create([
            'nombre' => 'Curso Nuevo', 'ciclo' => '1', 'tipo_curso' => 'obligatorio',
            'horas_teoria' => 1, 'horas_practica' => 0, 'horas_totales' => 1, 'creditos' => 1
        ]);

        $response = $this->postJson("/api/horarios/{$horario->idHorario}/generar-automatico");
        if ($response->status() !== 200) {
            dump($response->json());
        }
        $response->assertStatus(200);

        // Verificar que NO se asignó a ESTE profesor
        $this->assertDatabaseMissing('horario_cursos', [
            'FK_idHorario' => $horario->idHorario,
            'FK_idCurso' => $cursoNuevo->idCurso,
            'FK_idProfesor' => $profesor->idProfesor
        ]);
    }
}
