<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profesor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;


class UserController extends Controller
{
    public function index()
    {
        try {
            $users = User::with('roles')->get();
            
            $usersData = [];
            foreach ($users as $user) {
                $roles = $user->getRoleNames();
                $esProfesor = $roles->contains('profesor');
                
                $userData = [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'estado' => $user->estado,
                    'roles' => $roles,
                    'es_profesor' => $esProfesor,
                    'es_admin' => $roles->contains('admin')
                ];

                // Solo buscar datos de profesor si es necesario
                if ($esProfesor) {
                    $profesor = Profesor::where('FK_user_id', $user->id)->first();
                    if ($profesor) {
                        $userData['profesor'] = [
                            'dataprofesor' => $profesor
                        ];
                    }
                }

                $usersData[] = $userData;
            }

            return response()->json([
                'success' => true,
                'data' => $usersData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar los usuarios'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $request->validate([
                'name' => 'required|string|max:100',
                'email' => 'required|string|email|max:100|unique:users,email',
                'password' => 'required|string|min:6|confirmed',
                'role' => 'required|int|in:1,2'
            ]);

            // Crear el usuario
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'estado' => 'activo' // Estado por defecto
            ]);

            // Asignar el rol
            if ($request->has('role')) {
                // Opción 1: Si usas Spatie Laravel Permission
                if (class_exists(\Spatie\Permission\Traits\HasRoles::class) && in_array(\Spatie\Permission\Traits\HasRoles::class, class_uses($user))) {
                    $user->assignRole($request->role);
                }
                // Opción 2: Si tienes tu propio sistema de roles
                else if (method_exists($user, 'roles')) {
                    $user->roles()->attach($request->role);
                }
                // Opción 3: Guardar directamente en una columna 'role'
                else {
                    $user->update(['role' => $request->role]);
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Usuario creado exitosamente',
                'data' => [
                    'user' => $user->load('roles'), // Cargar relaciones si existen
                    'role' => $request->role
                ]
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error al crear usuario: ' . $e->getMessage(), [
                'request' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error interno del servidor al crear el usuario',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'name' => 'sometimes|string|max:100',
                'email' => 'sometimes|string|email|max:100|unique:users,email,' . $id,
                'password' => 'sometimes|string|min:6|confirmed',
                'role' => 'sometimes|int|in:1,2'
        ]);

        $user = User::findOrFail($id);
        $user->update($request->all());
        return response()->json(['status' => 'success', 'data' => $user]);


        } catch (\Exception $e) {
             return response()->json([
                'success' => false,
                'message' => 'Error al cargar el usuario' . $e->getMessage()
            ], 500);
        }



        
    }




    public function destroy($id)
    {
        

          try {
            $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
             return response()->json([
                'success' => false,
                'message' => 'Error al cargar los usuarios'
            ], 500);
        }
    }

}