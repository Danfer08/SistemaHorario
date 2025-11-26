<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Validation\Rule;

class RolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Cargar roles sin relaciones primero
            $roles = Role::get();
            
            // Luego cargar los datos adicionales por separado
            $data = [];
            foreach ($roles as $rol) {
                $usersCount = DB::table('model_has_roles')
                    ->where('role_id', $rol->id)
                    ->where('model_type', config('auth.providers.users.model'))
                    ->count();
                    
                $permissions = DB::table('role_has_permissions')
                    ->join('permissions', 'role_has_permissions.permission_id', '=', 'permissions.id')
                    ->where('role_has_permissions.role_id', $rol->id)
                    ->pluck('permissions.name');
                    
                $data[] = [
                    'id' => $rol->id,
                    'name' => $rol->name,
                    'guard_name' => $rol->guard_name,
                    'usuarios' => $usersCount,
                    'permisos' => $permissions,
                    'created_at' => $rol->created_at->toDateString(),
                ];
            }

            return response()->json(['success' => true, 'data' => $data]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false, 
                'message' => 'Error al cargar roles: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name|max:255',
            'permisos' => 'nullable|array',
            'permisos.*' => 'string|exists:permissions,name',
        ]);

        DB::beginTransaction();
        try {
            // Crear el rol
            $rol = Role::create(['name' => $request->name, 'guard_name' => 'web']);

            // Asignar permisos usando consultas directas en lugar de syncPermissions
            if ($request->has('permisos') && !empty($request->permisos)) {
                $permissionIds = Permission::whereIn('name', $request->permisos)
                    ->pluck('id')
                    ->toArray();
                
                // Insertar permisos directamente en la tabla
                foreach ($permissionIds as $permissionId) {
                    DB::table('role_has_permissions')->insert([
                        'role_id' => $rol->id,
                        'permission_id' => $permissionId
                    ]);
                }
            }

            DB::commit();

            // Devolver el rol con el formato esperado por el frontend
            $rolData = [
                'id' => $rol->id,
                'name' => $rol->name,
                'guard_name' => $rol->guard_name,
                'usuarios' => 0,
                'permisos' => $request->permisos ?? [],
                'created_at' => $rol->created_at->toDateString(),
            ];

            return response()->json(['success' => true, 'message' => 'Rol creado exitosamente', 'data' => $rolData], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Error al crear el rol: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function getPermissions()
    {
        try {
            // Obtener permisos directamente con consulta
            $permissions = DB::table('permissions')
                ->select('id', 'name', 'guard_name', 'created_at')
                ->get()
                ->map(function ($perm) {
                    // Extraer categoría del nombre del permiso (ej: 'gest_usuarios' -> 'gest')
                    $parts = explode('.', $perm->name);
                    $categoryName = count($parts) > 1 ? $parts[0] : 'general';
                    
                    // Mapeo de nombres de categoría para una mejor presentación
                    $categoryMap = [
                        'gest' => 'Administración',
                        'admin' => 'General',
                        'security' => 'Seguridad',
                        'crear_horario' => 'Horarios'
                    ];

                    $categoryKey = explode('_', $parts[0])[0];
                    $category = $categoryMap[$categoryKey] ?? ucfirst($categoryName);

                    return [
                        'id' => $perm->id,
                        'name' => $perm->name,
                        'descripcion' => 'Permiso para ' . str_replace('_', ' ', $perm->name),
                        'categoria' => $category,
                    ];
                });

            return response()->json(['success' => true, 'data' => $permissions]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error al obtener permisos: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $rol = Role::find($id);
        if (!$rol) {
            return response()->json(['success' => false, 'message' => 'Rol no encontrado'], 404);
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('roles')->ignore($rol->id)],
            'permisos' => 'nullable|array',
            'permisos.*' => 'string|exists:permissions,name',
        ]);

        DB::beginTransaction();
        try {
            // Actualizar nombre del rol
            $rol->name = $request->name;
            $rol->save();

            // Sincronizar permisos usando consultas directas
            if ($request->has('permisos')) {
                // Eliminar permisos actuales
                DB::table('role_has_permissions')->where('role_id', $rol->id)->delete();
                
                // Agregar nuevos permisos si se proporcionaron
                if (!empty($request->permisos)) {
                    $permissionIds = Permission::whereIn('name', $request->permisos)
                        ->pluck('id')
                        ->toArray();
                    
                    foreach ($permissionIds as $permissionId) {
                        DB::table('role_has_permissions')->insert([
                            'role_id' => $rol->id,
                            'permission_id' => $permissionId
                        ]);
                    }
                }
            }

            DB::commit();

            // Obtener datos actualizados para la respuesta
            $usersCount = DB::table('model_has_roles')
                ->where('role_id', $rol->id)
                ->where('model_type', config('auth.providers.users.model'))
                ->count();
                
            $permissions = DB::table('role_has_permissions')
                ->join('permissions', 'role_has_permissions.permission_id', '=', 'permissions.id')
                ->where('role_has_permissions.role_id', $rol->id)
                ->pluck('permissions.name');

            $rolData = [
                'id' => $rol->id,
                'name' => $rol->name,
                'guard_name' => $rol->guard_name,
                'usuarios' => $usersCount,
                'permisos' => $permissions,
                'created_at' => $rol->created_at->toDateString(),
            ];

            return response()->json(['success' => true, 'message' => 'Rol actualizado exitosamente', 'data' => $rolData]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Error al actualizar el rol: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $rol = Role::find($id);
        if (!$rol) {
            return response()->json(['success' => false, 'message' => 'Rol no encontrado'], 404);
        }

        // Verificar si es un rol protegido
        if (in_array($rol->name, ['admin', 'profesor', 'coordinador'])) {
            return response()->json(['success' => false, 'message' => 'No se pueden eliminar los roles protegidos.'], 403);
        }

        // Verificar si tiene usuarios asignados
        $usersCount = DB::table('model_has_roles')
            ->where('role_id', $rol->id)
            ->where('model_type', config('auth.providers.users.model'))
            ->count();

        if ($usersCount > 0) {
            return response()->json(['success' => false, 'message' => "No se puede eliminar el rol porque tiene {$usersCount} usuario(s) asignado(s)."], 422);
        }

        DB::beginTransaction();
        try {
            // Eliminar permisos asociados al rol
            DB::table('role_has_permissions')->where('role_id', $rol->id)->delete();
            
            // Eliminar el rol
            $rol->delete();

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Rol eliminado exitosamente']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Error al eliminar el rol: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Obtener un rol específico con sus permisos
     */
    public function show($id)
    {
        try {
            $rol = Role::find($id);
            if (!$rol) {
                return response()->json(['success' => false, 'message' => 'Rol no encontrado'], 404);
            }

            $usersCount = DB::table('model_has_roles')
                ->where('role_id', $rol->id)
                ->where('model_type', config('auth.providers.users.model'))
                ->count();
                
            $permissions = DB::table('role_has_permissions')
                ->join('permissions', 'role_has_permissions.permission_id', '=', 'permissions.id')
                ->where('role_has_permissions.role_id', $rol->id)
                ->pluck('permissions.name');

            $rolData = [
                'id' => $rol->id,
                'name' => $rol->name,
                'guard_name' => $rol->guard_name,
                'usuarios' => $usersCount,
                'permisos' => $permissions,
                'created_at' => $rol->created_at->toDateString(),
            ];

            return response()->json(['success' => true, 'data' => $rolData]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error al obtener el rol: ' . $e->getMessage()], 500);
        }
    }
}