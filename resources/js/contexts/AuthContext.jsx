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
            // El backend devuelve { success: true, user: { ... } }
            if (response.data?.success && response.data?.user) {
                setUser(response.data.user);
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
            const response = await axios.post(`${API_URL}/login`, credentials, { headers: { 'Content-Type': 'application/json' } });
            
            // Si el login fue exitoso, el backend ya devuelve el usuario
            if (response.data?.success && response.data?.user) {
                setUser(response.data.user);
                setAlert({ type: 'success', message: '¡Bienvenido! Has iniciado sesión correctamente.' });
                return { success: true };
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
            await axios.post(`${API_URL}/logout`);
        } finally {
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
            await fetchUser();
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
