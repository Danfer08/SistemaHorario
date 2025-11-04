import React, { useState, useEffect } from 'react';
import { Building, Filter, Calendar, Clock, Users, BookOpen, Search } from 'lucide-react';
import axios from 'axios';

const HorarioViewSalones = () => {
    const [salones, setSalones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtros, setFiltros] = useState({
        semestre: '',
        salon: '',
        dia: ''
    });
    const [semestresDisponibles, setSemestresDisponibles] = useState([]);
    const [dias] = useState(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']);
    const [horas] = useState(['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']);

    useEffect(() => {
        cargarHorariosSalones();
    }, []);

    const cargarHorariosSalones = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/salones/horariosalon');
            setSalones(response.data.data);

            console.log('salones con horarios: ', response.data.data);
            
            // Extraer semestres únicos
            const semestresUnicos = [...new Set(
                response.data.data.flatMap(salon => 
                    Object.keys(salon.horarios_por_semestre || {})
                )
            )];

            setSemestresDisponibles(semestresUnicos);
            
            // Seleccionar primer semestre por defecto
            if (semestresUnicos.length > 0) {
                setFiltros(prev => ({ ...prev, semestre: semestresUnicos[0] }));
            }
            
        } catch (err) {
            setError('Error al cargar los horarios de salones');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar salones según los filtros aplicados
    const salonesFiltrados = salones.filter(salon => {
    if (filtros.salon && salon.salon.id !== Number(filtros.salon)) return false;
    if (filtros.semestre && !salon.horarios_por_semestre[filtros.semestre]) return false;
    return true;
    });

    // Obtener horarios para un salón específico en el semestre seleccionado
    const obtenerHorariosSalon = (salon) => {
        if (!filtros.semestre) return [];
        return salon.horarios_por_semestre[filtros.semestre] || [];
    };

    const getDuracionEnHoras = (horaInicio, horaFin) => {
        if (!horaInicio || !horaFin) return 1;
        const [h1] = horaInicio.split(':').map(Number);
        const [h2] = horaFin.split(':').map(Number);
        return Math.max(1, h2 - h1);
    };

    const getPosicionHoraria = (hora) => {
        const [horas, minutos] = hora.split(':').map(Number);
        return horas + (minutos / 60);
    };

    const diasFiltrados = React.useMemo(() => {
        if (filtros.dia) {
            return dias.filter(d => d === filtros.dia);
        }
        return dias;
    }, [filtros.dia, dias]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando horarios de salones...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-600 text-2xl">!</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={cargarHorariosSalones}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Building className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-800">Horarios de Salones</h1>
                </div>
                <p className="text-gray-600">Visualiza la ocupación de los salones por semestre</p>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Semestre
                            </label>
                            <select 
                                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                                value={filtros.semestre}
                                onChange={(e) => setFiltros({ ...filtros, semestre: e.target.value })}
                            >
                                {semestresDisponibles.map(semestre => (
                                    <option key={semestre} value={semestre}>{semestre}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Building className="w-4 h-4 inline mr-2" />
                                Salón
                            </label>
                            <select 
                                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                                value={filtros.salon}
                                onChange={(e) => setFiltros({ ...filtros, salon: e.target.value })}
                            >
                                <option value="">Todos los salones</option>
                                {salones.map(salon => (
                                    <option key={salon.salon.id} value={salon.salon.id}>
                                        {salon.salon.id} ({salon.salon.tipo})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Filter className="w-4 h-4 inline mr-2" />
                                Día
                            </label>
                            <select 
                                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                                value={filtros.dia}
                                onChange={(e) => setFiltros({ ...filtros, dia: e.target.value })}
                            >
                                <option value="">Todos los días</option>
                                {dias.map(dia => (
                                    <option key={dia} value={dia}>{dia}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setFiltros({ semestre: '', salon: '', dia: '' })}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                        Limpiar Filtros
                    </button>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Salones</p>
                            <p className="text-2xl font-bold text-blue-600">{salones.length}</p>
                        </div>
                        <Building className="w-8 h-8 text-blue-100" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Semestres Confirmados</p>
                            <p className="text-2xl font-bold text-green-600">{semestresDisponibles.length}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-green-100" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Salones Filtrados</p>
                            <p className="text-2xl font-bold text-purple-600">{salonesFiltrados.length}</p>
                        </div>
                        <Filter className="w-8 h-8 text-purple-100" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Semestre Actual</p>
                            <p className="text-lg font-bold text-orange-600">{filtros.semestre || 'Ninguno'}</p>
                        </div>
                        <Search className="w-8 h-8 text-orange-100" />
                    </div>
                </div>
            </div>

            {/* Grid de Horarios por Salón */}
            {salonesFiltrados.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay salones que coincidan</h3>
                    <p className="text-gray-600">Intenta ajustar los filtros para ver los horarios</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {salonesFiltrados.map(salon => (
                        <div key={salon.salon.id} className="bg-white rounded-xl shadow-md p-6">
                            {/* Header del Salón */}
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Salón {salon.salon.id}
                                    </h3>
                                    <p className="text-gray-600">
                                        Capacidad: {salon.salon.capacidad} estudiantes • Tipo: {salon.salon.tipo}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Horarios en {filtros.semestre}</p>
                                    <p className="text-lg font-bold text-blue-600">
                                        {obtenerHorariosSalon(salon).length} clases
                                    </p>
                                </div>
                            </div>

                            {/* Grid del Horario - VERSIÓN CORREGIDA */}
                            <div className="overflow-x-auto">
                                <div className="relative" style={{ minWidth: '1000px' }}>
                                    {/* Grid principal con estructura corregida */}
                                    <div className="grid gap-2" style={{ 
                                        gridTemplateColumns: `60px repeat(${diasFiltrados.length}, 1fr)`,
                                        gridTemplateRows: `auto repeat(${horas.length}, 80px)`
                                    }}>
                                        {/* Celda vacía en la esquina */}
                                        <div className="bg-blue-600 text-white p-3 rounded-lg font-semibold text-center text-sm sticky left-0 z-30">
                                            Hora
                                        </div>
                                        
                                        {/* Headers de días */}
                                        {diasFiltrados.map(dia => (
                                            <div key={dia} className="bg-blue-600 text-white p-3 rounded-lg font-semibold text-center text-sm sticky top-0 z-20">
                                                {dia}
                                            </div>
                                        ))}

                                        {/* Filas de horas y celdas */}
                                        {horas.map((hora, horaIndex) => (
                                            <React.Fragment key={hora}>
                                                {/* Celda de hora */}
                                                <div className="bg-blue-50 p-3 rounded-lg font-medium text-center text-gray-700 text-sm flex items-center justify-center sticky left-0 z-10">
                                                    {hora}
                                                </div>
                                                
                                                {/* Celdas vacías para cada día */}
                                                {diasFiltrados.map(dia => (
                                                    <div 
                                                        key={`${dia}-${hora}`} 
                                                        className="bg-gray-50 border-2 border-gray-200 rounded-lg relative"
                                                    >
                                                        {/* Renderizar clases dentro de las celdas correspondientes */}
                                                        {obtenerHorariosSalon(salon)
                                                            .filter(clase => {
                                                                console.log('Filtrando clase:', clase);
                                                                if (filtros.dia && clase.dia !== filtros.dia) return false;
                                                                if (clase.dia !== dia) return false;
                                                                
                                                                const horaInicioPos = getPosicionHoraria(clase.Hora_inicio);
                                                                const horaActualPos = getPosicionHoraria(hora);
                                                                const horaFinPos = getPosicionHoraria(clase.Hora_fin);
                                                                
                                                                return horaInicioPos <= horaActualPos && horaActualPos < horaFinPos;
                                                            })
                                                            .map((clase, index) => {
                                                                const duracion = getDuracionEnHoras(clase.Hora_inicio, clase.Hora_fin);
                                                                const horaInicioIndex = horas.findIndex(h => 
                                                                    getPosicionHoraria(h) === getPosicionHoraria(clase.Hora_inicio)
                                                                );
                                                                
                                                                // Solo renderizar en la primera hora de la clase
                                                                if (horaIndex !== horaInicioIndex) return null;

                                                                return (
                                                                    <div 
                                                                        key={index}
                                                                        className="absolute left-0 right-0 top-0 bottom-0 p-2 rounded-lg border-2 text-xs bg-gradient-to-br from-green-100 to-green-50 border-green-400 shadow-sm hover:shadow-md z-20"
                                                                        style={{ 
                                                                            height: `calc(${duracion * 80}px + ${(duracion - 1) * 8}px)`,
                                                                            zIndex: 20
                                                                        }}
                                                                    >
                                                                        <div className="font-bold text-green-900 mb-1 truncate">{clase.horario_curso.curso.nombre}</div>
                                                                        <div className="text-green-700 mb-1">G{clase.horario_curso.Grupo}</div>
                                                                        <div className="text-green-600 truncate">{clase.horario_curso.profesor.nombre}</div>
                                                                        <div className="text-green-500 text-xs mt-1">
                                                                            {clase.Hora_inicio} - {clase.Hora_fin}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                    </div>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Lista de Clases del Salón */}
                            {obtenerHorariosSalon(salon).length > 0 && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-2">Clases en este salón:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {obtenerHorariosSalon(salon).map((clase, index) => (
                                            <div key={index} className="bg-white p-3 rounded border text-sm">
                                                <div className="font-medium text-gray-800">{clase.curso}</div>
                                                <div className="text-gray-600">
                                                    {clase.dia} {clase.Hora_inicio}-{clase.Hora_fin}
                                                </div>
                                                <div className="text-gray-500 text-xs">
                                                    Grupo {clase.horario_curso.Grupo} • {clase.horario_curso.profesor.nombre}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HorarioViewSalones;