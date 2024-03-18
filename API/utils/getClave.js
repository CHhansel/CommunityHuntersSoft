// function getClave(tipoDocumento = "", tipoCedula = "", 
// cedula = "", situacion = "", codigoPais = "", consecutivo = "", codigoSeguridad = "", sucursal = "", terminal = "") {

function getClave(tipoDocumento = "", tipoCedula = "", cedula = "", situacion = "", codigoPais = "", consecutivo = "", codigoSeguridad = "", sucursal = "", terminal = "") {
  // Asignación de valores predeterminados si son necesarios
  tipoDocumento = tipoDocumento || "FE"; // Puedes cambiar estos valores por defecto
  tipoCedula = tipoCedula || "fisico";
  cedula = cedula || "";
  situacion = situacion || "normal";
  codigoPais = codigoPais || "506";
  consecutivo = consecutivo || "";
  codigoSeguridad = codigoSeguridad || "";
  sucursal = sucursal || "001";
  terminal = terminal || "00001";
  // Obtener la fecha actual
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // +1 porque los meses empiezan en 0
  const ano = fecha.getFullYear().toString().substr(-2);
  // Funciones para formatear y validar datos
  function validarYFormatearCedula(tipo, cedula) {
      if (!cedula || !/^\d+$/.test(cedula)) {
          return "Error: La cédula debe ser numérica y no vacía";
      }
      let longitud = tipo === 'fisico' || tipo === '01' ? 12 : 12;
      return cedula.padStart(longitud, '0');
  }

  function validarYFormatearCodigo(codigo, longitud) {
      if (!codigo || !/^\d+$/.test(codigo)) {
          return "Error: El código debe ser numérico y no vacío";
      }
      return codigo.padStart(longitud, '0');
  }

  // Validar y formatear los datos
  cedula = validarYFormatearCedula(tipoCedula, cedula);
  consecutivo = validarYFormatearCodigo(consecutivo, 10);
  codigoSeguridad = validarYFormatearCodigo(codigoSeguridad, 8);
  sucursal = validarYFormatearCodigo(sucursal, 3);
  terminal = validarYFormatearCodigo(terminal, 5);

  // Comprobar si hubo errores en la validación
  if (cedula.startsWith("Error") || consecutivo.startsWith("Error") || codigoSeguridad.startsWith("Error") || sucursal.startsWith("Error") || terminal.startsWith("Error")) {
      return { error: "Validación fallida", detalles: [cedula, consecutivo, codigoSeguridad, sucursal, terminal] };
  }

  // Convertir tipo de documento y situación a su código correspondiente
  const tiposDocumento = { "FE": "01", "ND": "02", "NC": "03", "TE": "04", "CCE": "05", "CPCE": "06", "RCE": "07" };
  const situaciones = { "normal": "1", "contingencia": "2", "sininternet": "3" };

  tipoDocumento = tiposDocumento[tipoDocumento] || "";
  situacion = situaciones[situacion] || "";

  // Construir la clave
  const clave = codigoPais + dia + mes + ano + cedula + sucursal + terminal + tipoDocumento + consecutivo + situacion + codigoSeguridad;
  const consecutivoFInal = sucursal + terminal + tipoDocumento + consecutivo

  return {
      clave: clave,
      consecutivo: consecutivoFInal,
      longitud: clave.length
  };
}
  
  // Exporta la función para utilizarla en otras partes de tu aplicación
  module.exports = {
    getClave,
  };
  