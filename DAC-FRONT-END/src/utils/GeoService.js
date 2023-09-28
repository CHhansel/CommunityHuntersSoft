import data from './provincias_cantones_distritos_costa_rica.json';

// Método para obtener todas las provincias
export const getProvincias = () => {
  return Object.values(data.provincias).map(provincia => provincia.nombre);
}

// Método para obtener todos los cantones de una provincia específica
export const getCantones = (provinciaNombre) => {
  const provincia = Object.values(data.provincias).find(p => p.nombre === provinciaNombre);
  if (!provincia) return [];
  return Object.values(provincia.cantones).map(canton => canton.nombre);
}

// Método para obtener todos los distritos de un cantón específico
export const getDistritos = (provinciaNombre, cantonNombre) => {
  const provincia = Object.values(data.provincias).find(p => p.nombre === provinciaNombre);
  if (!provincia) return [];
  const canton = Object.values(provincia.cantones).find(c => c.nombre === cantonNombre);
  if (!canton) return [];
  return Object.values(canton.distritos);
}
