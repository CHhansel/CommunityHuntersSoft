import data from './provincias_cantones_distritos_costa_rica.json';

// Método para obtener todas las provincias
export const getProvincias = () => {
  return Object.values(data.provincias).map(provincia => provincia.nombre);
}

// Suponiendo que 'data' es el array de objetos importado de tu JSON

// Método para obtener todos los cantones de una provincia específica por idProvincia
export const getCantones = (idProvincia) => {
  // Filtrar los items que coincidan con el idProvincia
  const cantones = data.filter(item => item.idProvincia === idProvincia);
  
  // Crear un nuevo arreglo de objetos con los cantones únicos
  const cantonesUnicos = Array.from(new Set(cantones.map(item => item.idCanton)))
    .map(idCanton => {
      return {
        idCanton: idCanton,
        nombreCanton: cantones.find(item => item.idCanton === idCanton).nombreCanton
      };
    });

  return cantonesUnicos;
};
// Método para obtener todos los distritos de un cantón específico en una provincia
export const getDistritos = (idProvincia, idCanton) => {
  // Filtrar los items que coincidan con el idProvincia y idCanton
  const distritos = data.filter(item => item.idProvincia === idProvincia && item.idCanton === idCanton);
  
  // Crear un nuevo arreglo de objetos con los distritos únicos
  const distritosUnicos = Array.from(new Set(distritos.map(item => item.idDistrito)))
    .map(idDistrito => {
      return {
        idDistrito: idDistrito,
        nombreDistrito: distritos.find(item => item.idDistrito === idDistrito).nombreDistrito
      };
    });

  return distritosUnicos;
};

