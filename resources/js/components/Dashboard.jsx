import React, { useState } from 'react';
import { LogOut, Home, Users, Briefcase, Calendar, BookOpen, Clock, ListChecks, Factory, BarChart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Elimina la lógica de auth local y usa el contexto compartido

// --- COMPONENTES DE LA INTERFAZ ---

// Datos de la navegación basados en la imagen del usuario
const navigationData = [
    {
        section: 'Gestión Horaria',
        items: [
            { name: 'Horarios', icon: Home, key: 'horarios' },
            { name: 'Mi Horario (Profesores)', icon: Calendar, key: 'mi-horario' },
            { name: 'Plan Académico', icon: BookOpen, key: 'plan-academico' },
        ]
    },
    {
        section: 'Administración',
        items: [
            { name: 'Crear Horario', icon: Clock, key: 'crear-horario' },
            { name: 'Gestión Profesores', icon: Briefcase, key: 'gestion-profesores' },
            { name: 'Gestión Cursos', icon: ListChecks, key: 'gestion-cursos' },
            { name: 'Gestión Salones', icon: Factory, key: 'gestion-salones' },
        ]
    },
    {
        section: 'Seguridad',
        items: [
            { name: 'Usuarios', icon: Users, key: 'usuarios' },
            { name: 'Roles', icon: BarChart, key: 'roles' },
        ]
    }
];

// Componente para un ítem de navegación
const NavItem = ({ icon: Icon, name, isSelected, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center space-x-3 p-3 text-sm font-medium cursor-pointer transition-colors duration-200 
            ${isSelected 
                ? 'bg-blue-600 text-white shadow-lg rounded-lg' 
                : 'text-gray-700 hover:bg-gray-200 hover:text-blue-700 rounded-lg'}
            active:scale-[0.98]`} // Efecto de click para mejor UX táctil
    >
        <Icon size={20} className="flex-shrink-0" />
        <span className="truncate">{name}</span>
    </div>
);

// Componente de la Barra Lateral (Sidebar)
const Sidebar = ({ currentView, setCurrentView, logout, user }) => {
    // Colores basados en la imagen (Azul para barra lateral, Gris claro para fondo, Gris oscuro para texto)
    const sidebarBg = 'bg-gray-100'; // Fondo gris claro de la barra lateral
    const accentColor = 'bg-blue-500'; // Color de acento para la línea divisoria

    return (
        <div className={`flex flex-col h-full w-64 ${sidebarBg} border-r border-gray-300 shadow-xl transition-transform duration-300 ease-in-out`}>
            {/* Header del Sidebar */}
            <div className={`p-6 text-xl font-bold text-blue-700 border-b-4 ${accentColor} border-opacity-70 shadow-inner`}>
                Sistema Horarios
            </div>

            {/* Contenido de Navegación */}
            <div className="flex-grow p-4 space-y-6 overflow-y-auto">
                {navigationData.map((section, index) => (
                    <div key={index} className="space-y-1">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mt-4 mb-2">
                            {section.section}
                        </h3>
                        {section.items.map(item => (
                            <NavItem
                                key={item.key}
                                icon={item.icon}
                                name={item.name}
                                isSelected={currentView === item.key}
                                onClick={() => setCurrentView(item.key)}
                            />
                        ))}
                        {/* Línea divisoria basada en la imagen */}
                        {index < navigationData.length - 1 && (
                            <div className="h-px bg-gray-300 mx-3 my-4"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pie de página con perfil y Logout */}
            <div className="p-4 border-t border-gray-300">
                {user && (
                    <div className="text-sm text-gray-600 mb-3 p-2 bg-gray-200 rounded-lg">
                        <p className="font-semibold text-gray-800 truncate">Bienvenido(a),</p>
                        <p className="truncate">{user.name || user.email}</p>
                    </div>
                )}
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center space-x-2 p-3 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md active:scale-[0.99]"
                >
                    <LogOut size={18} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
};

// Componente de Contenido Principal (Content)
const MainContent = ({ currentView, user }) => {
    let contentTitle = '';
    let ContentComponent = null;

    // Buscar el nombre de la vista actual
    navigationData.forEach(section => {
        const item = section.items.find(i => i.key === currentView);
        if (item) {
            contentTitle = item.name;
        }
    });

    // En una aplicación real, aquí cargarías el componente específico para cada vista.
    const PlaceholderComponent = () => (
        <div className="p-6">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4">{contentTitle}</h1>
            <p className="text-gray-600">
                Este es el contenido de la vista **{contentTitle}**. Aquí se implementará la lógica de gestión de {contentTitle.toLowerCase()}.
            </p>
            <p className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded">
                **UX Tip:** El contenido principal debe ser simple, claro, y las acciones más importantes (crear, editar, eliminar) deben ser botones prominentes y fáciles de encontrar.
            </p>
            {user && (
                <pre className="mt-6 p-4 bg-gray-100 rounded text-sm overflow-x-auto border">
                    <code>
                        {JSON.stringify(user, null, 2)}
                    </code>
                </pre>
            )}
        </div>
    );

    return (
        <main className="flex-grow overflow-auto bg-white">
            <PlaceholderComponent />
        </main>
    );
};

// Componente Principal del Dashboard (App)
const Dashboard = () => {
    const { user, isLoading, logout } = useAuth();
    const [currentView, setCurrentView] = useState('horarios'); // Vista inicial

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen text-lg">Cargando dashboard...</div>;
    }
    
    // Si no hay usuario, puedes redirigirlo a la pantalla de login (en una app real)
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <p className="text-red-500 mb-4">No estás autenticado. Por favor, inicia sesión.</p>
                {/* Nota: En tu implementación, aquí se renderizaría el LoginForm */}
                <button 
                    onClick={() => console.log("Redirigir a login...")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                >
                    Ir a Login
                </button>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden font-sans">
            {/* Sidebar (W-64, altura completa) */}
            <Sidebar 
                currentView={currentView} 
                setCurrentView={setCurrentView} 
                logout={logout}
                user={user}
            />
            
            {/* Contenido Principal (Ocupa el resto del espacio) */}
            <MainContent 
                currentView={currentView}
                user={user}
            />

            {/* Overlay para móvil si necesitas esconder/mostrar el sidebar */}
            {/* Nota UX: En pantallas pequeñas (md:hidden), se puede ocultar el sidebar por defecto y mostrarlo con un botón de hamburguesa. */}
        </div>
    );
};

// Componente contenedor que debe ser renderizado en la raíz de tu aplicación.
// En una implementación real, envolverías tu <App/> o el <Dashboard/> con <AuthProvider>.

export default function App() {
    return (
        <Dashboard />
    );
}
