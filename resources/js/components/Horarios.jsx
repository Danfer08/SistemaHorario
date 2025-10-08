import React, { useEffect, useState } from "react";

function Horarios() {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    // Aquí llamas a tu API Laravel (ejemplo: /api/cursos)
    fetch("/api/cursos")
      .then((res) => res.json())
      .then((data) => setCursos(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Cursos</h1>
      <ul className="list-disc pl-6">
        {cursos.map((curso) => (
          <li key={curso.idCurso}>
            {curso.nombre} - {curso.ciclo} ciclo
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Horarios;
