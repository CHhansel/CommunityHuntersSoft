const { jsbn } = require("node-forge");

function createXML(datosFactura) {
  // Calcular totales
  let totalMercanciasGravadas = 0;
  let totalImpuesto = 0;
  datosFactura.LineaDeDetalle.forEach((linea) => {
    const totalLinea = linea.price * linea.quantity;
    const impuestoLinea = totalLinea * (linea.tax_rate / 100);
    totalMercanciasGravadas += totalLinea;
    totalImpuesto += impuestoLinea;
  });

  // Calcular otros cargos si existen
  let totalOtrosCargos = 0;
  if (datosFactura.OtrosCargos) {
    datosFactura.OtrosCargos.forEach((cargo) => {
      totalOtrosCargos += parseFloat(cargo.monto);
    });
  }

  // Total del comprobante
  const totalComprobante =
    totalMercanciasGravadas + totalImpuesto + totalOtrosCargos;
  let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
    <FacturaElectronica xmlns="https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/facturaElectronica" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <Clave>${datosFactura.KeyXml}</Clave>
        <CodigoActividad>${datosFactura.CodigoActividad}</CodigoActividad>
        <NumeroConsecutivo>${datosFactura.Consecutivo}</NumeroConsecutivo>
        <FechaEmision>${datosFactura.Fecha}</FechaEmision>
        <Emisor>
            <Nombre>Andrés Francisco Zamora Soto</Nombre>
            <Identificacion>
                <Tipo>${datosFactura.Emisor.tipoDeIdentificacion}</Tipo>
                <Numero>${datosFactura.Emisor.identificacion}</Numero>
            </Identificacion>
            <NombreComercial>Community Hunters</NombreComercial>
            <Ubicacion>
                <Provincia>${datosFactura.Emisor.Provincia}</Provincia>
                <Canton>${datosFactura.Emisor.Canton}</Canton>
                <Distrito>${datosFactura.Emisor.Distrito}</Distrito>
                <OtrasSenas>${datosFactura.Emisor.direccionExacta}</OtrasSenas>
            </Ubicacion>
            <Telefono>
                <CodigoPais>${datosFactura.Emisor.codigoTelefono}</CodigoPais>
                <NumTelefono>${datosFactura.Emisor.Telefono}</NumTelefono>
            </Telefono>
            <CorreoElectronico>info@communityhunters.com</CorreoElectronico>
        </Emisor>
        <Receptor>
            <Nombre>${datosFactura.Cliente.nombre}</Nombre>
            <Identificacion>
                <Tipo>${datosFactura.Cliente.tipoIdentificacion}</Tipo>
                <Numero>${datosFactura.Cliente.idenficacion}</Numero>
            </Identificacion>
            <CorreoElectronico>${datosFactura.Cliente.email}</CorreoElectronico>
        </Receptor>
        <CondicionVenta>${datosFactura.CondicionDeVenta}</CondicionVenta>
        <MedioPago>${datosFactura.MedioDePago}</MedioPago>
        <DetalleServicio>`;

  datosFactura.LineaDeDetalle.forEach((linea, index) => {
    xmlString += `
            <LineaDetalle>
                <NumeroLinea>${index + 1}</NumeroLinea>
                <Codigo>${linea.cabys_code}</Codigo>
                <Cantidad>${linea.quantity}</Cantidad>
                <UnidadMedida>${linea.unit_of_measure}</UnidadMedida>
                <Detalle>${linea.description}</Detalle>
                <PrecioUnitario>${linea.price}</PrecioUnitario>
                <MontoTotal>${linea.price * linea.quantity}</MontoTotal>
                <SubTotal>${linea.price * linea.quantity}</SubTotal>
                <Impuesto>
                    <Codigo>01</Codigo>
                    <CodigoTarifa>08</CodigoTarifa>
                    <Tarifa>${linea.tax_rate}.00</Tarifa>
                    <Monto>${
                      linea.price * linea.quantity * (linea.tax_rate / 100)
                    }</Monto>
                </Impuesto>
                <MontoTotalLinea>${
                  linea.price * linea.quantity +
                  linea.price * linea.quantity * (linea.tax_rate / 100)
                }</MontoTotalLinea>
            </LineaDetalle>`;
  });

  xmlString += `</DetalleServicio>`;

  if (datosFactura.OtrosCargos && datosFactura.OtrosCargos.length > 0) {
    xmlString += `<OtrosCargos>`;
    datosFactura.OtrosCargos.forEach((cargo) => {
      xmlString += `
                <Detalle>${cargo.detalle}</Detalle>
                <Porcentaje>${cargo.porcentaje}</Porcentaje>
                <MontoCargo>${cargo.monto}</MontoCargo>`;
    });
    xmlString += `</OtrosCargos>`;
  }

  xmlString += `
    <ResumenFactura>
        <CodigoTipoMoneda>
            <CodigoMoneda>CRC</CodigoMoneda>
            <TipoCambio>1</TipoCambio>
        </CodigoTipoMoneda>
        <TotalServGravados>0</TotalServGravados> <!-- Ajustar según corresponda -->
        <TotalMercanciasGravadas>${totalMercanciasGravadas.toFixed(
          2
        )}</TotalMercanciasGravadas>
        <TotalGravado>${totalMercanciasGravadas.toFixed(2)}</TotalGravado>
        <TotalVenta>${totalMercanciasGravadas.toFixed(2)}</TotalVenta>
        <TotalVentaNeta>${totalMercanciasGravadas.toFixed(2)}</TotalVentaNeta>
        <TotalImpuesto>${totalImpuesto.toFixed(2)}</TotalImpuesto>
        <TotalOtrosCargos>${totalOtrosCargos.toFixed(2)}</TotalOtrosCargos>
        <TotalComprobante>${totalComprobante.toFixed(2)}</TotalComprobante>
    </ResumenFactura>
</${datosFactura.footerDocument}>`;

  return xmlString;
}

module.exports = {
  createXML,
};



