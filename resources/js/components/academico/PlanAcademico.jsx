import React, { useState, useEffect } from 'react';
import { BookOpen, Download, Eye, Clock, Award, Filter, Loader } from 'lucide-react';
import axios from 'axios';

const PlanAcademicoView = () => 
  {
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
        const [selectedCiclo, setSelectedCiclo] = useState('1');
        const [cursos, setCursos] = useState([]);
        const [stats, setStats] = useState({
          total: 0,
          obligatorios: 0,
          electivos: 0,
          total_horas: 0
        });

            useEffect(() => {
              const token = localStorage.getItem('token');
              if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              }
            }, []);
              useEffect(() => {
                cargarCursos();
              }, []);


            const cargarCursos = async () => {
              setLoading(true);
              try {
                const response = await axios.get('/api/cursos');
                setCursos(response.data.data);
                setStats(response.data.stats);
              } catch (error) {
                console.error('Error al cargar cursos:', error);
                setError('Error al cargar los cursos');
              } finally {
                setLoading(false);
              }
            };


  const descargarPDF = () => {
    // Crear enlace de descarga
    const link = document.createElement('a');
    link.href = '/pdfs/MALLA_CURRICULAR.pdf';
    link.download = 'Malla_Curricular.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const verMallaCompleta = () => {
    // Abrir PDF en nueva ventana
    window.open('/pdfs/MALLA_CURRICULAR.pdf', '_blank');
  };

  // Agrupar cursos por ciclo
  const cursosPorCiclo = cursos.reduce((acc, curso) => {

    const cicloKey = String(curso.ciclo);
    
    if (!acc[cicloKey]) {
      acc[curso.ciclo] = [];
    }
    acc[curso.ciclo].push(curso);
    return acc;
  }, {});

  // Lista del ciclo seleccionado (por defecto vacía si no hay datos)
  const cursosActual = cursosPorCiclo[selectedCiclo] || [];

  // Calcular estadísticas por ciclo
  const calcularStatsCiclo = (cursosCiclo) => {
    const obligatorios = cursosCiclo.filter(c => c.tipo_curso === 'obligatorio').length;
    const electivos = cursosCiclo.filter(c => c.tipo_curso === 'electivo').length;
    const totalHoras = cursosCiclo.reduce((sum, c) => sum + (c.horas_totales || 0), 0);
    const creditos = cursosCiclo.reduce((sum, c) => sum + (c.horas_totales || 0), 0); // Aproximación

    return {
      total: cursosCiclo.length,
      obligatorios,
      electivos,
      total_horas: totalHoras,
      creditos
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Plan Académico</h1>
            </div>
            <p className="text-gray-600">Malla curricular y plan de estudios de Ingeniería de Sistemas</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={verMallaCompleta}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-black rounded-lg hover:bg-green-700 transition"
            >
              <Eye className="w-4 h-4" />
              Ver Malla Completa
            </button>
            <button 
              onClick={descargarPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 transition"
            >
              <Download className="w-4 h-4" />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Cursos</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <BookOpen className="w-12 h-12 text-blue-100" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Obligatorios</p>
              <p className="text-3xl font-bold text-green-600">{stats.obligatorios}</p>
            </div>
            <Award className="w-12 h-12 text-green-100" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Electivos</p>
              <p className="text-3xl font-bold text-purple-600">{stats.electivos}</p>
            </div>
            <Clock className="w-12 h-12 text-purple-100" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Horas</p>
              <p className="text-3xl font-bold text-orange-600">{stats.total_horas}</p>
            </div>
            <Clock className="w-12 h-12 text-orange-100" />
          </div>
        </div>
      </div>

      {/* Selector de Ciclo */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Filtrar por Ciclo</h3>
        </div>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 text-black">
          {[1,2,3,4,5,6,7,8,9,10].map(ciclo => (
            <button
              key={ciclo}
              onClick={() => setSelectedCiclo(ciclo.toString())}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCiclo === ciclo.toString()
                  ? 'bg-blue-600 text-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {ciclo}° Ciclo
            </button>
          ))}
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Vista por Ciclo */}
      {selectedCiclo && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">{selectedCiclo}° Ciclo</h3>
            {loading && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm">Cargando...</span>
              </div>
            )}
          </div>

          {/* Estadísticas del Ciclo */}
          {(() => {
            const statsCiclo = calcularStatsCiclo(cursosActual);
            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Cursos</p>
                  <p className="text-2xl font-bold text-blue-600">{statsCiclo.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Horas Semanales</p>
                  <p className="text-2xl font-bold text-green-600">{statsCiclo.total_horas}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Créditos</p>
                  <p className="text-2xl font-bold text-purple-600">{statsCiclo.creditos}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Electivos</p>
                  <p className="text-2xl font-bold text-orange-600">{statsCiclo.electivos}</p>
                </div>
              </div>
            );
          })()}

          {/* Lista de Cursos del Ciclo */}
          <div className="space-y-3">
            {cursosActual.map(curso => (
              <div 
                key={curso.idCurso} 
                className={`p-4 rounded-lg border-l-4 ${
                  curso.tipo_curso === 'obligatorio' 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'bg-green-50 border-green-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{curso.nombre}</h4>
                    {/* aqui se el {curso.descripcion || 'Sin descripción'} por solamente 'Sin descripción*/}
                    <p className="text-sm text-gray-600">{'Sin descripción'}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-gray-600">Horas</p>
                      <p className="font-semibold text-blue-600">{curso.horas_totales}h</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Tipo</p>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        curso.tipo_curso === 'obligatorio' 
                          ? 'bg-blue-200 text-blue-800' 
                          : 'bg-green-200 text-green-800'
                      }`}>
                        {curso.tipo_curso}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Créditos</p>
                      <p className="font-semibold text-purple-600">{curso.horas_totales}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vista General por Ciclos */}
      <div className="space-y-6">
        {Object.keys(cursosPorCiclo).sort((a,b) => Number(a) - Number(b)).map(ciclo => (
          <div key={ciclo} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-blue-600 text-black px-6 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{ciclo}° Ciclo</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span>{cursosPorCiclo[ciclo].length} cursos</span>
                  <span>{cursosPorCiclo[ciclo].reduce((sum, c) => sum + c.horas_totales, 0)}h</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cursosPorCiclo[ciclo].map(curso => (
                  <div 
                    key={curso.idCurso}
                    className={`p-4 rounded-lg border ${
                      curso.tipo_curso === 'obligatorio' 
                        ? 'border-blue-200 bg-blue-50' 
                        : 'border-green-200 bg-green-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 text-sm">{curso.nombre}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        curso.tipo_curso === 'obligatorio' 
                          ? 'bg-blue-200 text-blue-800' 
                          : 'bg-green-200 text-green-800'
                      }`}>
                        {curso.tipo_curso}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{curso.horas_totales}h</span>
                      <span>{curso.horas_totales} créditos</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

};


export default PlanAcademicoView;

