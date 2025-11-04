import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Download, AlertCircle, Send, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MiHorarioView = () => {
  const { user } = useAuth();
  const [selectedSemestre, setSelectedSemestre] = useState('2025-I');
  const [showSolicitud, setShowSolicitud] = useState(false);
  const [solicitud, setSolicitud] = useState('');

  // Datos del profesor logueado (ejemplo - esto vendría de tu API)
  const profesor = {
    nombre: 'Luis Honorato Pita Astengo',
    totalHoras: 18,
    maxHoras: 20
  };


  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const horas = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00','19:00','20:00','21:00','22:00','23:00'];

  const handleEnviarSolicitud = () => {
    // Aquí iría la lógica para enviar la solicitud al backend
    alert('Solicitud enviada correctamente');
    setSolicitud('');
    setShowSolicitud(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Mi Horario</h1>
        </div>
        <p className="text-gray-600">Bienvenido, Prof. {profesor.nombre}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Carga Horaria</p>
              <p className="text-3xl font-bold text-blue-600">{profesor.totalHoras}h</p>
              <p className="text-xs text-gray-500 mt-1">de {profesor.maxHoras}h máximo</p>
            </div>
            <Clock className="w-12 h-12 text-blue-100" />
          </div>
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all" 
              style={{ width: `${(profesor.totalHoras / profesor.maxHoras) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Secciones</p>
              <p className="text-3xl font-bold text-blue-600">{misClases.length}</p>
              <p className="text-xs text-gray-500 mt-1">asignadas</p>
            </div>
            <BookOpen className="w-12 h-12 text-blue-100" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Estudiantes</p>
              <p className="text-3xl font-bold text-blue-600">
                {misClases.reduce((sum, c) => sum + c.estudiantes, 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">bajo su cargo</p>
            </div>
            <Users className="w-12 h-12 text-blue-100" />
          </div>
        </div>
      </div>

      {/* Selector de Semestre y Acciones */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semestre Académico</label>
            <select 
              className="px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              value={selectedSemestre}
              onChange={(e) => setSelectedSemestre(e.target.value)}
            >
              <option value="2025-I">2025 - I</option>
              <option value="2024-II">2024 - II</option>
              <option value="2024-I">2024 - I</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowSolicitud(!showSolicitud)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Send className="w-4 h-4" />
              Solicitar Cambio
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition">
              <Download className="w-4 h-4" />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Formulario de Solicitud de Cambio */}
      {showSolicitud && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">Solicitar Cambio de Horario</h3>
              <textarea 
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="4"
                placeholder="Describe el motivo de tu solicitud de cambio de horario..."
                value={solicitud}
                onChange={(e) => setSolicitud(e.target.value)}
              />
              <div className="flex gap-3 mt-3">
                <button 
                  onClick={handleEnviarSolicitud}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Enviar Solicitud
                </button>
                <button 
                  onClick={() => setShowSolicitud(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mi Horario Grid */}
      <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Mi Horario Semanal - {selectedSemestre}
        </h3>

        <div className="min-w-[900px]">
          <div className="grid grid-cols-7 gap-2">
            {/* Header */}
            <div className="bg-blue-600 text-white p-3 rounded-lg font-semibold text-center">
              Hora
            </div>
            {dias.map(dia => (
              <div key={dia} className="bg-blue-600 text-white p-3 rounded-lg font-semibold text-center">
                {dia}
              </div>
            ))}

            {/* Filas de horarios */}
            {horas.map(hora => (
              <React.Fragment key={hora}>
                <div className="bg-blue-50 p-3 rounded-lg font-medium text-center text-gray-700 flex items-center justify-center">
                  {hora}
                </div>
                {dias.map(dia => {
                  const clase = misClases.find(c => c.dia === dia && c.hora.startsWith(hora.slice(0, 2)));
                  return (
                    <div 
                      key={`${dia}-${hora}`} 
                      className={`p-3 rounded-lg border-2 min-h-[100px] transition ${
                        clase 
                          ? 'bg-gradient-to-br from-blue-100 to-blue-50 border-blue-400 shadow-sm hover:shadow-md cursor-pointer' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {clase && (
                        <div className="text-xs">
                          <div className="font-bold text-blue-900 mb-2">{clase.curso}</div>
                          <div className="flex items-center gap-1 text-gray-700 mb-1">
                            <span>Ciclo {clase.ciclo} - Grupo {clase.grupo}</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600 mb-1">
                            <MapPin className="w-3 h-3" />
                            <span className="font-medium">{clase.salon}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Users className="w-3 h-3" />
                            <span>{clase.estudiantes} est.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Cursos */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalle de Mis Cursos</h3>
        <div className="space-y-3">
          {Array.from(new Set(misClases.map(c => c.curso))).map(curso => {
            const secciones = misClases.filter(c => c.curso === curso);
            const totalEstudiantes = secciones.reduce((sum, s) => sum + s.estudiantes, 0);
            return (
              <div key={curso} className="border-2 border-blue-100 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-300 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-lg">{curso}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {secciones.length} {secciones.length === 1 ? 'sección' : 'secciones'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total estudiantes</p>
                    <p className="text-2xl font-bold text-blue-600">{totalEstudiantes}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {secciones.map((sec, idx) => (
                    <div key={idx} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      Grupo {sec.grupo} - {sec.estudiantes} est.
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MiHorarioView;