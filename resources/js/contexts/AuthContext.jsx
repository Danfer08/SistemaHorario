import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';
const API_URL = `${API_BASE_URL}/api`;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    axios.defaults.withCredentials = true;

    const getCsrfToken = async () => {
        await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`);
    };

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/user`);
            // Normalizar varias formas de respuesta del backend:
            // - { success: true, user: { ... } }
            // - { user: { ... } }
            // - { id: 1, name: '...' } (user object directo)
            const payload = response.data ?? {};
            const realUser = payload.user ?? payload.data?.user ?? payload;

            // Si realUser parece ser un objeto de usuario válido (tiene id o email o name)
            if (realUser && (realUser.id || realUser.email || realUser.name)) {

                setUser(realUser);
                return { success: true };
            }


            setUser(null);
            return { success: false };
        } catch (error) {
            setUser(null);
            return { success: false };
        }
    };

    const login = async (credentials) => {
        try {
            await getCsrfToken();
            const response = await axios.post(`${API_URL}/login`, credentials, { 
                headers: { 'Content-Type': 'application/json' }
            });
            
            // Si el login fue exitoso
            if (response.data?.token) {
                // Guardar el token
                localStorage.setItem('token', response.data.token);
                // Configurar el token para futuras peticiones
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

                // Obtener y normalizar los datos del usuario usando fetchUser
                const fetched = await fetchUser();
                
                if (fetched.success) {
                    setAlert({ type: 'success', message: '¡Bienvenido! Has iniciado sesión correctamente.' });
                    
                    return { success: true };
                }
                // Si fetchUser no devolvió usuario, limpiar token y fallar
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
                return { success: false, message: 'No se pudo obtener la información del usuario.' };
            }
            return { success: false, message: 'Error en el login' };
        } catch (error) {
            const message = error?.response?.data?.message || 'Credenciales inválidas o error de conexión.';
            setAlert({ type: 'error', message });
            return { success: false, message };
        }
    };

    const register = async (payload) => {
        try {
            await getCsrfToken();
            const response = await axios.post(`${API_URL}/register`, payload, { headers: { 'Content-Type': 'application/json' } });
            
            // Si el registro fue exitoso, el backend ya devuelve el usuario
            if (response.data?.success && response.data?.user) {
                setUser(response.data.user);
                setAlert({ type: 'success', message: '¡Cuenta creada exitosamente! Bienvenido al sistema.' });
                return { success: true };
            }
            return { success: false, message: 'Error en el registro' };
        } catch (error) {
            const message = error?.response?.data?.message || 'Error al registrar.';
            setAlert({ type: 'error', message });
            throw { message, response: error.response };
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await axios.post(`${API_URL}/logout`, {}, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
        } finally {
            // Limpiar el token y los headers
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setAlert({ type: 'info', message: 'Has cerrado sesión correctamente.' });
        }
    };

    const clearAlert = () => {
        setAlert(null);
    };

    // Auto-clear alert after 5 seconds
    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            // Verificar si hay un token guardado
            const token = localStorage.getItem('token');
            if (token) {
                // Configurar el token para las peticiones
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await fetchUser();
            }
            setIsLoading(false);
        };
        init();
    }, []);

    const value = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isLoading,
        alert,
        login,
        register,
        logout,
        clearAlert,
    }), [user, isLoading, alert]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
