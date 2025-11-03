// js/utils/yearsHorario.jsx

/**
 * Utilidad para gestionar años académicos en el sistema
 * Siempre muestra desde 2025 hasta 5 años en el futuro desde el actual
 */

// Año base fijo
const BASE_YEAR = 2025;

// Obtener el año actual
const getCurrentYear = () => {
  return new Date().getFullYear();
};

// Generar array de años desde 2025 hasta año actual + 5
export const generateAcademicYears = () => {
  const currentYear = getCurrentYear();
  const endYear = currentYear + 5;
  const years = [];
  
  for (let year = BASE_YEAR; year <= endYear; year++) {
    years.push(year);
  }
  
  return years;
};

// Obtener años académicos en formato para selects
export const getAcademicYearsOptions = () => {
  const years = generateAcademicYears();
  return years.map(year => ({
    value: year.toString(),
    label: year.toString()
  }));
};

// Obtener el año por defecto (actual, pero si es menor que 2025, usar 2025)
export const getDefaultYear = () => {
  const currentYear = getCurrentYear();
  return Math.max(BASE_YEAR, currentYear).toString();
};

// Verificar si un año es válido en el sistema
export const isValidAcademicYear = (year) => {
  const years = generateAcademicYears();
  return years.includes(parseInt(year));
};

// Obtener el rango de años como texto (ej: "2025-2030")
export const getAcademicYearsRange = () => {
  const years = generateAcademicYears();
  return `${years[0]} - ${years[years.length - 1]}`;
};

// Obtener el año más reciente disponible
export const getLatestYear = () => {
  const years = generateAcademicYears();
  return years[years.length - 1].toString();
};

// Hook personalizado para usar en componentes React
export const useAcademicYears = () => {
  const years = generateAcademicYears();
  const options = getAcademicYearsOptions();
  const defaultYear = getDefaultYear();
  const latestYear = getLatestYear();
  
  return {
    years,
    options,
    defaultYear,
    latestYear,
    isValidAcademicYear,
    getAcademicYearsRange
  };
};

// Ejemplos de uso:
/*
// En 2025: [2025, 2026, 2027, 2028, 2029, 2030]
// En 2026: [2025, 2026, 2027, 2028, 2029, 2030, 2031]  
// En 2027: [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032]
*/

export default {
  BASE_YEAR,
  generateAcademicYears,
  getAcademicYearsOptions,
  getDefaultYear,
  getLatestYear,
  isValidAcademicYear,
  getAcademicYearsRange,
  useAcademicYears
};