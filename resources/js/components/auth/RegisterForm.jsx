import React, { useState } from 'react';
// RUTA CORREGIDA: Asumiendo que el contexto está en 'resources/js/contexts/AuthContext.jsx'
import { useAuth } from '../../contexts/AuthContext'; 
import { User, Mail, Lock, CheckCircle } from 'lucide-react'; // Usando iconos Lucide

/*
Formulario dejado de usar, pero mantenido para referencia futura.
El formulario de registro fue eliminado de la vista AuthPage.
Sin embargo, este componente se mantiene en el código base para referencia futura o posibles reimplementaciones.
*/



const RegisterForm = ({ onToggleMode }) => {
    // Es CRÍTICO que la función 'register' esté disponible en el contexto
    const { register } = useAuth(); 

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        
        // Limpiar error cuando el usuario escriba
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
        else if (formData.name.trim().length < 2) newErrors.name = 'El nombre debe tener al menos 2 caracteres';

        if (!formData.email) newErrors.email = 'El email es requerido';
        else if (!/^[^\s@]+@unap\.edu\.pe$/i.test(formData.email)) newErrors.email = 'Debe ser un correo institucional (@unap.edu.pe)';

        if (!formData.password) newErrors.password = 'La contraseña es requerida';
        else if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';

        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Las contraseñas no coinciden';
            // También se puede establecer el error en el campo 'password' si no coinciden.
            newErrors.password = newErrors.password || 'Las contraseñas no coinciden'; 
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({}); // Limpiar errores previos
        
        try {
            const result = await register(formData); 
            
            if (result.success) {
                // El contexto ya actualizó el estado y mostró la alerta
                console.log("Registro exitoso");
            } else {
                setErrors({ general: result.message || 'Error en el registro' });
            }
        
        } catch (error) {
            console.error("Error de registro:", error);
            const serverErrors = error.response?.data?.errors;
            const generalMessage = error.response?.data?.message || error.message || 'Error desconocido al registrar.';

            if (serverErrors) {
                // Si hay errores de validación (ej. email ya existe)
                setErrors(serverErrors);
            } else {
                setErrors({ general: generalMessage });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = (name) => `
        w-full pl-10 pr-4 py-3 border 
        ${errors[name] ? 'border-red-500' : 'border-gray-300'} 
        rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 
        transition-all duration-200 text-gray-800
    `;

    // Ícono para alternar visibilidad de contraseña
    const ToggleIcon = showPassword ? Lock : Mail;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md">
                {/* Cabecera y Logo (manteniendo el color verde UNAP) */}
                <div className="bg-green-700 rounded-2xl w-32 h-32 mx-auto mb-8 flex flex-col items-center justify-center shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="text-white text-center p-2">
                        <div className="text-2xl font-black">UNAP</div>
                        <div className="text-xs font-medium mt-1 leading-tight">Sistema Horarios</div>
                    </div>
                </div>
                
                {/* Contenedor del formulario con diseño limpio */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 space-y-5 border border-gray-100">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-extrabold text-gray-900">Crear Cuenta</h2>
                        <p className="text-sm text-gray-600 mt-1">Regístrate para acceder al sistema de horarios.</p>
                    </div>

                    {errors.general && (
                        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-lg text-sm transition-opacity duration-300">
                            {errors.general}
                        </div>
                    )}

                    {/* CAMPO: Nombre */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={20} className="text-green-600" />
                        </div>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Nombre completo"
                            value={formData.name}
                            onChange={handleChange}
                            className={inputClasses('name')}
                        />
                        {errors.name && (<div className="mt-1 text-sm text-red-600 font-medium">{errors.name}</div>)}
                    </div>

                    {/* CAMPO: Email */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail size={20} className="text-green-600" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="tu.nombre@unap.edu.pe"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClasses('email')}
                        />
                        {errors.email && (<div className="mt-1 text-sm text-red-600 font-medium">{errors.email}</div>)}
                    </div>

                    {/* CAMPO: Contraseña */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={20} className="text-green-600" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            className={inputClasses('password')}
                        />
                        {/* Botón para ver contraseña (Mejora de UX) */}
                         <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 hover:text-green-700 transition-colors"
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            <ToggleIcon size={18} />
                        </button>

                        {errors.password && (<div className="mt-1 text-sm text-red-600 font-medium">{errors.password}</div>)}
                    </div>

                    {/* CAMPO: Confirmar Contraseña */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CheckCircle size={20} className="text-green-600" />
                        </div>
                        <input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            placeholder="Confirmar contraseña"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className={inputClasses('password_confirmation')}
                        />
                        {errors.password_confirmation && (<div className="mt-1 text-sm text-red-600 font-medium">{errors.password_confirmation}</div>)}
                    </div>

                    {/* Botón de registro con animación de carga */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-700 text-white py-3 px-4 rounded-lg font-bold hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-green-400 disabled:cursor-not-allowed transition-all duration-300 shadow-xl transform active:scale-[0.99]"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Creando cuenta...
                            </div>
                        ) : (
                            'Crear Mi Cuenta'
                        )}
                    </button>

                    {/* Enlace para login */}
                    <div className="text-center pt-2">
                        <button
                            type="button"
                            onClick={onToggleMode}
                            className="text-sm font-medium text-green-700 hover:text-green-900 transition-colors duration-200 underline-offset-4 hover:underline"
                        >
                            ¿Ya tienes cuenta? Inicia sesión aquí
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
