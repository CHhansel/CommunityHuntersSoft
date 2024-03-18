const { jsbn } = require("node-forge");

function createXML(datosFactura) {
  // Calcular totales
  let totalMercanciasSinIVA = 0;
  let totalImpuesto = 0;
  datosFactura.LineaDeDetalle.forEach((linea) => {
    const precioSinIVA = linea.price / (1 + linea.tax_rate / 100);
    const impuestoLinea = linea.price - precioSinIVA;
    totalMercanciasSinIVA += precioSinIVA * linea.quantityInOrder;
    totalImpuesto += impuestoLinea * linea.quantityInOrder;
  });

  // Calcular otros cargos si existen
  let totalOtrosCargos = 0;
  if (datosFactura.OtrosCargos) {
    datosFactura.OtrosCargos.forEach((cargo) => {
      totalOtrosCargos += parseFloat(cargo.monto);
    });
  }
  console.log("datos ess ", datosFactura);
  // Total del comprobante
  const totalComprobante =
    totalMercanciasSinIVA + totalImpuesto + totalOtrosCargos;

  let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
        <${datosFactura.headDocument}>
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
                <Numero>${datosFactura.Cliente.identificacion}</Numero>
            </Identificacion>
            <CorreoElectronico>${datosFactura.Cliente.email}</CorreoElectronico>
        </Receptor>
        <CondicionVenta>${datosFactura.CondicionDeVenta}</CondicionVenta>
        <MedioPago>${datosFactura.MedioDePago}</MedioPago>
        <DetalleServicio>`;

  datosFactura.LineaDeDetalle.forEach((linea,index) => {
    // Suponiendo que 'linea.price' es el precio con impuesto incluido y 'linea.tax_rate' es la tasa de impuesto.
    const precioSinImpuesto = linea.price / (1 + linea.tax_rate / 100);
    const impuestoLinea = linea.price - precioSinImpuesto;

    xmlString += `
    <LineaDetalle>
    <NumeroLinea>${index + 1}</NumeroLinea>
    <Codigo>${linea.cabys_code}</Codigo>
    <Cantidad>${linea.quantityInOrder}</Cantidad>
    <UnidadMedida>${linea.unit_of_measure}</UnidadMedida>
    <Detalle>${linea.description}</Detalle>
      <PrecioUnitario>${precioSinImpuesto.toFixed(2)}</PrecioUnitario>
      <MontoTotal>${(precioSinImpuesto * linea.quantityInOrder).toFixed(
        2
      )}</MontoTotal>
      <SubTotal>${(precioSinImpuesto * linea.quantityInOrder).toFixed(
        2
      )}</SubTotal>
      <Impuesto>
      <Codigo>01</Codigo>
      <CodigoTarifa>08</CodigoTarifa>
        <Tarifa>${linea.tax_rate}</Tarifa>
        <Monto>${impuestoLinea.toFixed(2)}</Monto>
      </Impuesto>
      <MontoTotalLinea>${(linea.price * linea.quantityInOrder).toFixed(
        2
      )}</MontoTotalLinea>
    </LineaDetalle>`;
    // Nota: Asegúrate de redondear o formatear los números correctamente como se requiere para tu factura.
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
        <TotalMercanciasGravadas>${totalMercanciasSinIVA.toFixed(
          2
        )}</TotalMercanciasGravadas>
        <TotalGravado>${totalMercanciasSinIVA.toFixed(2)}</TotalGravado>
        <TotalVenta>${totalMercanciasSinIVA.toFixed(2)}</TotalVenta>
        <TotalVentaNeta>${totalMercanciasSinIVA.toFixed(2)}</TotalVentaNeta>
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
