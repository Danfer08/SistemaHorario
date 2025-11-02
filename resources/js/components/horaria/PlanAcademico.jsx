import React, { useState } from 'react';
import { BookOpen, Download, FileText, Award, Clock, Eye, ChevronRight } from 'lucide-react';

const PlanAcademicoView = () => {
  const [selectedCiclo, setSelectedCiclo] = useState('1');
  const [showPDF, setShowPDF] = useState(false);

  // Datos de cursos por ciclo desde tu BD
  const cursosPorCiclo = {
    '1': [
      { nombre: 'Lenguaje, redacción y oratoria', tipo: 'obligatorio', horas: 5, creditos: 4 },
      { nombre: 'Matemática', tipo: 'obligatorio', horas: 5, creditos: 4 },
      { nombre: 'Inglés básico I', tipo: 'obligatorio', horas: 3, creditos: 3 },
      { nombre: 'Filosofía', tipo: 'obligatorio', horas: 4, creditos: 3 },
      { nombre: 'Derecho constitucional y derechos humanos', tipo: 'obligatorio', horas: 4, creditos: 3 },
      { nombre: 'Introducción a la ingeniería de sistemas e información', tipo: 'obligatorio', horas: 4, creditos: 3 },
      { nombre: 'Informática I', tipo: 'obligatorio', horas: 3, creditos: 3 },
      { nombre: 'Básquetbol', tipo: 'electivo', horas: 2, creditos: 1 },
      { nombre: 'Fútbol', tipo: 'electivo', horas: 2, creditos: 1 }
    ],
    '2': [
      { nombre: 'Cálculo diferencial', tipo: 'obligatorio', horas: 5, creditos: 4 },
      { nombre: 'Inglés básico II', tipo: 'obligatorio', horas: 3, creditos: 3 },
      { nombre: 'Álgebra lineal', tipo: 'obligatorio', horas: 5, creditos: 4 },
      { nombre: 'Algoritmo y estructura de datos', tipo: 'obligatorio', horas: 4, creditos: 3 },
      { nombre: 'Realidad nacional y desarrollo regional amazónico', tipo: 'obligatorio', horas: 5, creditos: 4 },
      { nombre: 'Informática II', tipo: 'obligatorio', horas: 3, creditos: 3 },
      { nombre: 'Metodología de la investigación científica', tipo: 'obligatorio', horas: 5, creditos: 4 },
      { nombre: 'Atletismo', tipo: 'electivo', horas: 2, creditos: 1 },
      { nombre: 'Voleibol', tipo: 'electivo', horas: 2, creditos: 1 }
    ],
    '3': [
      { nombre: 'Economía', tipo: 'obligatorio', horas: 4, creditos: 3 },
      { nombre: 'Cálculo integral', tipo: 'obligatorio', horas: 5, creditos: 4 },
      { nombre: 'Estadística y probabilidad', tipo: 'obligatorio', horas: 4, creditos: 3 },
      { nombre: 'Matemática discreta', tipo: 'obligatorio', horas: 4, creditos: 3 },
      { nombre: 'Lenguaje de programación I', tipo: 'obligatorio', horas: 4, creditos: 3 },
      { nombre: 'Física', tipo: 'obligatorio', horas: 5, creditos: 4 },
      { nombre: 'Base de datos I', tipo: 'obligatorio', horas: 4, creditos: 3 }
    ],
    '4': [
      { nombre: 'Física electrónica', tipo: 'obligatorio', horas: 5, creditos: 4 },
      { nombre: 'Estadística inferencial', tipo: 'obligatorio', horas: 4, creditos: 3 },
      { nombre: 'Inglés técnico I', tipo: 'obligatorio', horas: 3, creditos: 3 },
      { nombre: 'Base de datos II', tipo: 'obligatorio', horas: 4, creditos: 3 },
      { nombre: 'Administración general', tipo: 'obligatorio', horas: 4, creditos: 3 },
      { nombre: 'Ecuaciones diferenciales', tipo: 'obligatorio', horas: 5, creditos: 4 },
      { nombre: 'Lenguaje de programación II', tipo: 'obligatorio', horas: 4, creditos: 3 }
    ],
    '5': [
      { nombre: 'Electrónica digital', tipo: 'obligatorio', horas: 4, creditos: 3 },
      { nombre: 'Marketing digital', tipo: 'obligatorio', horas: 3, creditos: 3 },
      { nombre: 'Sistemas contables', tipo: 'obligatorio', horas: 3, creditos: 3 },
      { nombre: 'Taller de base de datos', tipo: 'obligatorio', horas: 4, creditos: 3 },
      { nombre: 'Lenguaje de programación III', tipo: 'obligatorio', horas: 8, creditos: 6 },
      { nombre: 'Teoría general de sistemas', tipo: 'obligatorio', horas: 3, creditos: 3 },
      { nombre: 'Ecología', tipo: 'obligatorio', horas: 3, creditos: 3 },
      { nombre: 'Métodos numéricos', tipo: 'obligatorio', horas: 4, creditos: 3 },
      { nombre: 'Tecnología multimedia', tipo: 'electivo', horas: 3, creditos: 2 },
      { nombre: 'Gestión de recursos humanos', tipo: 'electivo', horas: 3, creditos: 2 }
    ]
  };

  const ciclos = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const cursosActual = cursosPorCiclo[selectedCiclo] || [];
  
  const totalHoras = cursosActual.reduce((sum, c) => sum + c.horas, 0);
  const totalCreditos = cursosActual.reduce((sum, c) => sum + c.creditos, 0);
  const cursosObligatorios = cursosActual.filter(c => c.tipo === 'obligatorio').length;
  const cursosElectivos = cursosActual.filter(c => c.tipo === 'electivo').length;

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
            <p className="text-gray-600">Ingeniería de Sistemas e Informática</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowPDF(!showPDF)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              <Eye className="w-5 h-5" />
              {showPDF ? 'Ocultar Malla' : 'Ver Malla Completa'}
            </button>
            <a 
              href="/pdfs/plan-academico.pdf" 
              download
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              <Download className="w-5 h-5" />
              Descargar PDF
            </a>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      {showPDF && (
        <div className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span className="font-semibold">Malla Curricular - Plan de Estudios</span>
            </div>
            <button 
              onClick={() => setShowPDF(false)}
              className="text-white hover:text-blue-100 transition"
            >
              ✕
            </button>
          </div>
          <div className="p-4 bg-gray-50">
            <iframe 
              src="/pdfs/malla_curricular.pdf" 
              className="w-full h-[600px] rounded-lg border-2 border-gray-300"
              title="Plan Académico"
            />
          </div>
        </div>
      )}

      {/* Navegación por Ciclos */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Seleccionar Ciclo</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-black">
          {ciclos.map(ciclo => (
            <button
              key={ciclo}
              onClick={() => setSelectedCiclo(ciclo)}
              className={`p-4 rounded-lg font-semibold transition ${
                selectedCiclo === ciclo
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              {ciclo}°
            </button>
          ))}
        </div>
      </div>

      {/* Estadísticas del Ciclo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Cursos</p>
              <p className="text-3xl font-bold text-blue-600">{cursosActual.length}</p>
            </div>
            <BookOpen className="w-12 h-12 text-blue-100" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Horas Semanales</p>
              <p className="text-3xl font-bold text-blue-600">{totalHoras}</p>
            </div>
            <Clock className="w-12 h-12 text-blue-100" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Créditos</p>
              <p className="text-3xl font-bold text-blue-600">{totalCreditos}</p>
            </div>
            <Award className="w-12 h-12 text-blue-100" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Electivos</p>
              <p className="text-3xl font-bold text-blue-600">{cursosElectivos}</p>
              <p className="text-xs text-gray-500">de {cursosActual.length}</p>
            </div>
            <FileText className="w-12 h-12 text-blue-100" />
          </div>
        </div>
      </div>

      {/* Lista de Cursos */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Cursos del {selectedCiclo}° Ciclo
        </h3>

        <div className="space-y-3">
          {cursosActual.map((curso, idx) => (
            <div 
              key={idx}
              className="border-2 border-blue-100 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="bg-blue-100 text-blue-600 font-bold text-lg w-10 h-10 rounded-lg flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{curso.nombre}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        curso.tipo === 'obligatorio' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {curso.tipo === 'obligatorio' ? 'Obligatorio' : 'Electivo'}
                      </span>
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {curso.horas}h semanales
                      </span>
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {curso.creditos} créditos
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nota informativa */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Nota:</span> Para ver la malla curricular completa con prerequisitos y correquisitos, 
              haz clic en el botón "Ver Malla Completa" o descarga el PDF del plan de estudios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanAcademicoView;