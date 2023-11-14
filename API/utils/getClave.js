function getClave(
    tipoDocumento = "",
    tipoCedula = "",
    cedula = "",
    situacion = "",
    codigoPais = "",
    consecutivo = "",
    codigoSeguridad = ""
  ) {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Enero es 0!
    const ano = String(fecha.getFullYear()).slice(-2);
  
    // Asumiendo que recibes los valores desde un request HTTP
    // podrías obtenerlos así:
    // const { tipoDocumento, tipoCedula, cedula, situacion, codigoPais, consecutivo, codigoSeguridad } = req.body;
  
    // Validaciones y transformaciones similares a las del código PHP
    if (!codigoPais || !codigoSeguridad || !consecutivo) {
      throw new Error("Parámetros inválidos");
    }
  
    const sucursal = "001";
    const terminal = "00001";
  
    let tipoDoc = "";
    switch (tipoDocumento) {
      case "FE":
        tipoDoc = "01";
        break;
      case "ND":
        tipoDoc = "02";
        break;
      case "NC":
        tipoDoc = "03";
        break;
      case "TE":
        tipoDoc = "04";
        break;
      case "CCE":
        tipoDoc = "05";
        break;
      case "CPCE":
        tipoDoc = "06";
        break;
      case "RCE":
        tipoDoc = "07";
        break;
      default:
        throw new Error("Tipo de documento no reconocido");
    }
  
    let tipoIdentificacion = "";
    switch (tipoCedula) {
      case "fisico":
      case "01":
        tipoIdentificacion = cedula.padStart(12, "0");
        break;
      case "juridico":
      case "02":
        tipoIdentificacion = cedula.padStart(12, "0");
        break;
      case "dimex":
      case "03":
        tipoIdentificacion = cedula.padStart(12, "0");
        break;
      case "nite":
      case "04":
        tipoIdentificacion = cedula.padStart(12, "0");
        break;
      default:
        throw new Error("Tipo de cédula no reconocido");
    }
  
    let situacionFinal = "";
    switch (situacion) {
      case "normal":
        situacionFinal = "1";
        break;
      case "contingencia":
        situacionFinal = "2";
        break;
      case "sininternet":
        situacionFinal = "3";
        break;
      default:
        throw new Error("Situación no reconocida");
    }
  
    const consecutivoFinal =
      sucursal + terminal + tipoDoc + consecutivo.padStart(10, "0");
    const clave =
      codigoPais + dia + mes + ano + tipoIdentificacion + consecutivoFinal + situacionFinal + codigoSeguridad.padStart(8, "0");
  
    return {
      clave: clave,
      consecutivo: consecutivoFinal,
      length: clave.length,
    };
  }
  
  // Exporta la función para utilizarla en otras partes de tu aplicación
  module.exports = {
    getClave,
  };
  