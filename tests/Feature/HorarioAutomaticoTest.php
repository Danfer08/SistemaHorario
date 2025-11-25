<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Horario;
use App\Models\Curso;
use App\Models\Profesor;
use App\Models\Salon;
use App\Models\HorarioCurso;
use App\Models\DetalleHorarioCurso;

class HorarioAutomaticoTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed basic data if needed or create factories
    }

    public function test_generar_horario_automatico()
    {
        // 1. Create Environment
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password')
        ]);
        $this->actingAs($user);

        $horario = Horario::create([
            'año' => '2025',
            'etapa' => 'I',
            'estado' => 'borrador'
        ]);

        // Create Resources
        $salon = Salon::create([
            'codigo' => 'A101',
            'capacidad' => 40,
            'tipo' => 'normal',
            'disponibilidad' => 'habilitado',
            'pabellon' => 'A',
            'piso' => '1'
        ]);

        $profesor = Profesor::create([
            'nombre' => 'Juan',
            'apellido' => 'Perez',
            'dni' => '12345678',
            'correo' => 'juan@test.com',
            'telefono' => '999999999',
            'categoria' => 'principal',
            'estado' => 'activo'
        ]);

        $curso = Curso::create([
            'nombre' => 'Matematica I',
            'ciclo' => '1',
            'tipo_curso' => 'obligatorio',
            'horas_teoria' => 2,
            'horas_practica' => 2,
            'horas_totales' => 4,
            'creditos' => 4,
            'descripcion' => 'Curso basico'
        ]);

        // 2. Call Endpoint
        $response = $this->postJson("/api/horarios/{$horario->idHorario}/generar-automatico");

        // 3. Assertions
        $response->assertStatus(200);
        $response->assertJsonStructure(['message', 'errores']);

        // Check if assignment was created
        $this->assertDatabaseHas('horario_cursos', [
            'FK_idHorario' => $horario->idHorario,
            'FK_idCurso' => $curso->idCurso,
            'FK_idProfesor' => $profesor->idProfesor
        ]);

        // Check details
        $horarioCurso = HorarioCurso::where('FK_idHorario', $horario->idHorario)
            ->where('FK_idCurso', $curso->idCurso)
            ->first();

        $this->assertDatabaseHas('detalle_horario_cursos', [
            'FK_idHorarioCurso' => $horarioCurso->idHorarioCurso,
            'FK_idSalon' => $salon->idSalon
        ]);
    }

    public function test_evita_conflictos_salon()
    {
         // 1. Create Environment
         $user = User::create([
            'name' => 'Test User 2',
            'email' => 'test2@example.com',
            'password' => bcrypt('password')
        ]);
         $this->actingAs($user);
 
         $horario = Horario::create([
             'año' => '2025',
             'etapa' => 'I',
             'estado' => 'borrador'
         ]);
 
         $salon = Salon::create([
             'codigo' => 'A101',
             'capacidad' => 40,
             'tipo' => 'normal',
             'disponibilidad' => 'habilitado',
             'pabellon' => 'A',
             'piso' => '1'
         ]);
 
         $profesor1 = Profesor::create(['nombre' => 'P1', 'apellido' => 'A1', 'dni' => '111', 'correo' => 'p1@t.com', 'estado' => 'activo']);
         $profesor2 = Profesor::create(['nombre' => 'P2', 'apellido' => 'A2', 'dni' => '222', 'correo' => 'p2@t.com', 'estado' => 'activo']);
 
         $curso1 = Curso::create(['nombre' => 'C1', 'ciclo' => '1', 'tipo_curso' => 'obligatorio', 'horas_teoria' => 2, 'horas_practica' => 0, 'horas_totales' => 2, 'creditos' => 2]);
         $curso2 = Curso::create(['nombre' => 'C2', 'ciclo' => '1', 'tipo_curso' => 'obligatorio', 'horas_teoria' => 2, 'horas_practica' => 0, 'horas_totales' => 2, 'creditos' => 2]);
         $cursoElectivo = Curso::create(['nombre' => 'Electivo', 'ciclo' => '1', 'tipo_curso' => 'electivo', 'horas_teoria' => 2, 'horas_practica' => 0, 'horas_totales' => 2, 'creditos' => 2]);
 
         // Manually assign C1 to Monday 07:00-09:00 in Salon A101
         $hc1 = HorarioCurso::create([
             'FK_idHorario' => $horario->idHorario,
             'FK_idCurso' => $curso1->idCurso,
             'FK_idProfesor' => $profesor1->idProfesor,
             'Grupo' => '1',
             'tipo' => 'regular',
             'Nr_estudiantes' => 30
         ]);
         DetalleHorarioCurso::create([
             'FK_idHorarioCurso' => $hc1->idHorarioCurso,
             'FK_idSalon' => $salon->idSalon,
             'dia' => 'Lunes',
             'Hora_inicio' => '07:00:00',
             'Hora_fin' => '09:00:00'
         ]);
 
         // Run Auto Schedule
         $response = $this->postJson("/api/horarios/{$horario->idHorario}/generar-automatico");
         $response->assertStatus(200);
 
         // C2 should be assigned
         $this->assertDatabaseHas('horario_cursos', ['FK_idCurso' => $curso2->idCurso]);

         // Electivo should NOT be assigned
         $this->assertDatabaseMissing('horario_cursos', ['FK_idCurso' => $cursoElectivo->idCurso]);
 
         // C2 should NOT be assigned to Monday 07:00-09:00 in A101
         // It should be assigned elsewhere
         $hc2 = HorarioCurso::where('FK_idCurso', $curso2->idCurso)->first();
         $this->assertNotNull($hc2);
         
         $detalle2 = DetalleHorarioCurso::where('FK_idHorarioCurso', $hc2->idHorarioCurso)->first();
         
         // Assert it is NOT Monday 7-9
         $conflict = ($detalle2->dia === 'Lunes' && $detalle2->Hora_inicio === '07:00:00');
         $this->assertFalse($conflict, "Curso 2 was assigned to the conflicting slot");
    }
}
