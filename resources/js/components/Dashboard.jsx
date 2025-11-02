import React, { useState, useEffect } from 'react';
import { LogOut, Home, Users, Briefcase, Calendar, BookOpen, Clock, ListChecks, Factory, BarChart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';

// --- COMPONENTES DE LA INTERFAZ ---

// Datos de la navegación basados en la imagen del usuario
const allNavigationData = [
    {
        section: 'Gestión Horaria',
        items: [
            { name: 'Horarios', icon: Home, key: 'horarios' },
            { name: 'Mi Horario', icon: Calendar, key: 'mi-horario' },
            { name: 'Plan Académico', icon: BookOpen, key: 'plan-academico' },
        ]
    },
    {
        section: 'Administración',
        items: [
            { name: 'Gestion Horarios', icon: Clock, key: 'gestion-horarios'},
            { name: 'Gestión Profesores', icon: Briefcase, key: 'profesores', permission: 'gest_profesores' },
            { name: 'Gestión Cursos', icon: ListChecks, key: 'cursos', permission: 'gest_cursos' },
            { name: 'Gestión Salones', icon: Factory, key: 'salones', permission: 'gest_salones' },
        ],
        permission: 'admin.access'
    },
    {
        section: 'Seguridad',
        items: [
            { name: 'Usuarios', icon: Users, key: 'usuarios', permission: 'gest_usuarios' },
            { name: 'Roles', icon: BarChart, key: 'roles', permission: 'gest_roles' },
        ],
        permission: 'security.access' // Permiso general para ver esta sección
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
    const { can } = usePermissions();

    // Filtrar la navegación basada en los permisos del usuario
    const navigationData = allNavigationData
        .map(section => {
            // Si la sección requiere un permiso y el usuario no lo tiene, se descarta la sección entera.
            if (section.permission && !can(section.permission)) {
                return null;
            }
            // Filtra los items dentro de la sección
            const filteredItems = section.items.filter(item => !item.permission || can(item.permission));

            // Si después de filtrar no quedan items, no mostrar la sección
            return filteredItems.length > 0 ? { ...section, items: filteredItems } : null;
        })
        .filter(Boolean); // Elimina las secciones nulas

    return (
        <div className={`flex flex-col h-full w-64 bg-gray-100 border-r border-gray-300 shadow-xl transition-transform duration-300 ease-in-out`}>
            {/* Header del Sidebar */}
            <div className={`p-6 text-xl font-bold text-blue-700 border-b-4 border-blue-500 border-opacity-70 shadow-inner`}>
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
                                onClick={() => { 
                                    console.log('Sidebar click ->', item.key); 
                                    setCurrentView(item.key); 
                                }}
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

// Importación de todos los componentes
import HorariosCalendar from './horaria/HorariosCalendar';
import MiHorario from './profesor/MiHorario';
import PlanAcademico from './academico/PlanAcademico';
import GestionSalonesView from './admin/GestionSalones';
import GestionProfesoresView from './admin/GestionProfesores';
import GestionCursosView from './admin/GestionCursos';
import CrearHorarioView from './crearHorario/CrearHorario';
import GestionHorariosView from './crearHorario/GestionHorarios';
import UsuariosView from './seguridad/Usuarios';
import RolesView from './seguridad/Roles';

// Componente de Contenido Principal (Content)
const MainContent = ({ currentView, setCurrentView, user }) => {
    console.log('MainContent rendering view ->', currentView);

    let contentTitle = '';
    let content = null;

    // Verificar si es una ruta con parámetros como "crear-horario/123"
    const isCrearHorarioWithId = currentView.startsWith('crear-horario/');

    switch(true) {
        case currentView === 'horarios':
            contentTitle = 'Horarios';
            content = <HorariosCalendar user={user} />;
            break;
        case currentView === 'mi-horario':
            contentTitle = 'Mi Horario';
            content = <MiHorario user={user} />;
            break;
        case currentView === 'profesores':
            contentTitle = 'Gestión de Profesores';
            content = <GestionProfesoresView user={user} />;
            break;
        case currentView === 'cursos':
            contentTitle = 'Gestión de Cursos';
            content = <GestionCursosView user={user} />;
            break;
        case currentView === 'salones':
            contentTitle = 'Gestión de Salones';
            content = <GestionSalonesView user={user} />;
            break;
        case currentView === 'plan-academico':
            contentTitle = 'Plan Académico';
            content = <PlanAcademico user={user} />;
            break;
        case isCrearHorarioWithId:
            const horarioId = currentView.split('/')[1];
            contentTitle = horarioId ? 'Edición de Horario' : 'Crear Horario';
            content = <CrearHorarioView horarioId={horarioId} />;
            break;
        case currentView === 'crear-horario':
            contentTitle = 'Crear Horario';
            content = <CrearHorarioView />;
            break;
        case currentView === 'gestion-horarios':
            contentTitle = 'Gestión de Horarios';
            content = <GestionHorariosView setCurrentView={setCurrentView} />;
            break;
        case currentView === 'usuarios':
            contentTitle = 'Gestión de Usuarios';
            content = <UsuariosView user={user} />;
            break;
        case currentView === 'roles':
            contentTitle = 'Gestión de Roles';
            content = <RolesView user={user} />;
            break;
        default:
            contentTitle = 'Bienvenido';
            content = <HorariosCalendar user={user} />;
    }

    return (
        <main className="flex-grow overflow-auto bg-white">
            <div className="p-6">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-4">{contentTitle}</h1>
                {content}
            </div>
        </main>
    );
};

// Componente Principal del Dashboard (App)
const Dashboard = () => {
    const { user, isLoading, logout } = useAuth();
    const [currentView, setCurrentView] = useState('horarios');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mr-3"></div>
                Cargando dashboard...
            </div>
        );
    }

    
    // Si no hay usuario, puedes redirigirlo a la pantalla de login
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <p className="text-red-500 mb-4">No estás autenticado. Por favor, inicia sesión.</p>
                <button 
                    onClick={() => window.location.href = '/login'}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                >
                    Ir a Login
                </button>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden font-sans">
            {/* Sidebar */}
            <Sidebar 
                currentView={currentView} 
                setCurrentView={setCurrentView} 
                logout={logout}
                user={user}
            />
            
            {/* Main Content */}
            <MainContent 
                currentView={currentView}
                setCurrentView={setCurrentView}
                user={user}
            />
        </div>
    );
};

export default Dashboard;