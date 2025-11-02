<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login del usuario
     */
    public function login(Request $request)
    {
        try {
            // Validar datos del login
            $validated = $request->validate([
                'email' => ['required','email','regex:/@unap\\.edu\\.pe$/i'],
                'password' => 'required|string|min:6',
            ], [
                'email.required' => 'El email es requerido',
                'email.email' => 'El email no tiene un formato válido',
                'email.regex' => 'Debes usar tu correo institucional (@unap.edu.pe)',
                'password.required' => 'La contraseña es requerida',
                'password.min' => 'La contraseña debe tener al menos 6 caracteres',
            ]);

            // Intentar autenticación
            if (!Auth::attempt($validated)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email o contraseña incorrectos'
                ], 401);
            }
        
            $user = Auth::user();
            
            // Revocar tokens anteriores si existen
            $user->tokens()->delete();
            
            // Generar nuevo token
            $token = $user->createToken('api_token')->plainTextToken;
        
            return response()->json([
                'success' => true,
                'message' => '¡Login exitoso! Bienvenido al sistema',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'), // <-- AÑADIDO: Enviar permisos
                ],
                'token' => $token
            ], 200);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error en login: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor',
            ], 500);
        }
    }
    

    /**
     * Registro de usuario
     */
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => ['required','string','email','max:255','unique:users','regex:/@unap\\.edu\\.pe$/i'],
                'password' => 'required|string|min:6|confirmed',
                'password_confirmation' => 'required|string|min:6',
            ], [
                'name.required' => 'El nombre es requerido',
                'email.required' => 'El email es requerido',
                'email.email' => 'El email no tiene un formato válido',
                'email.unique' => 'Este email ya está registrado',
                'email.regex' => 'Debes usar tu correo institucional (@unap.edu.pe)',
                'password.required' => 'La contraseña es requerida',
                'password.min' => 'La contraseña debe tener al menos 6 caracteres',
                'password.confirmed' => 'Las contraseñas no coinciden',
                'password_confirmation.required' => 'La confirmación de contraseña es requerida',
            ]);

            // Crear usuario
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'email_verified_at' => now(), // Verificar email automáticamente
            ]);

            // Generar token de autenticación
            $token = $user->createToken('api_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => '¡Usuario registrado correctamente! Bienvenido al sistema',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->getRoleNames(), // <-- AÑADIDO
                    'permissions' => $user->getAllPermissions()->pluck('name'), // <-- AÑADIDO
                    'created_at' => $user->created_at,
                ],
                'token' => $token
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error en registro: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor',
            ], 500);
        }
    }
    

    /**
     * Obtener información del usuario autenticado
     */
    public function user(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(), // <-- AÑADIDO
                'permissions' => $user->getAllPermissions()->pluck('name'), // <-- AÑADIDO
                'created_at' => $user->created_at,
            ],
        ], 200);
    }

    /**
     * Logout del usuario
     */
    public function logout(Request $request)
    {
        // Revocar todos los tokens del usuario
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout exitoso',
        ], 200);
    }
}
