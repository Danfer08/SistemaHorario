
export const calcularHoraFin = (horaInicio, horasTotales) => {
  const [hora, minuto] = horaInicio.split(':').map(Number);
  const minutosTotales = horasTotales * 60;
  const minutosFin = hora * 60 + minuto + minutosTotales;
  
  const horaFin = Math.floor(minutosFin / 60);
  const minutoFin = minutosFin % 60;
  
  return `${horaFin.toString().padStart(2, '0')}:${minutoFin.toString().padStart(2, '0')}`;
};

export const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const horas = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00','18:00','19:00','20:00','21:00','22:00','23:00'];

export const configurarAxios = () => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};