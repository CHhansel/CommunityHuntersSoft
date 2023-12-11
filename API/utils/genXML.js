function generateXML(data) {
    let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
    <FacturaElectronica xmlns="https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/facturaElectronica" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <Clave>${data.KeyXml}</Clave>
        <CodigoActividad>${data.DataEmisor[0].CodeActivity}</CodigoActividad>
        <NumeroConsecutivo>${data.Consecutive}</NumeroConsecutivo>
        <FechaEmision>${data.DateDocument}</FechaEmision>
        <Emisor>
            <Nombre>${data.DataEmisor[0].Name}</Nombre>
            <Identificacion>
                <Tipo>${data.DataEmisor[0].TypeIdentification}</Tipo>
                <Numero>${data.DataEmisor[0].IdentificationNumber}</Numero>
            </Identificacion>
            <NombreComercial>${data.DataEmisor[0].TradeName}</NombreComercial>
            <Ubicacion>
                <Provincia>${data.DataEmisor[0].Province}</Provincia>
                <Canton>${data.DataEmisor[0].Canton}</Canton>
                <Distrito>${data.DataEmisor[0].District}</Distrito>
                <OtrasSenas>${data.DataEmisor[0].Address}</OtrasSenas>
            </Ubicacion>
            <Telefono>
                <CodigoPais>${data.DataEmisor[0].CodePhone}</CodigoPais>
                <NumTelefono>${data.DataEmisor[0].Phone}</NumTelefono>
            </Telefono>
            <CorreoElectronico>${data.DataEmisor[0].Email}</CorreoElectronico>
        </Emisor>`;
    
    if(data.DocumentHead[0].TypeIdentification && data.DocumentHead[0].IdentificationNumber.replace(/[^0-9]/g, '') && data.DocumentHead[0].NameClient && data.DocumentHead[0].Email) {
        xmlString += `
            <Receptor>
                <Nombre>${data.DocumentHead[0].NameClient}</Nombre>
                <Identificacion>
                    <Tipo>${data.DocumentHead[0].TypeIdentification}</Tipo>
                    <Numero>${data.DocumentHead[0].IdentificationNumber.replace(/[^0-9]/g, '')}</Numero>
                </Identificacion>
                <CorreoElectronico>${data.DocumentHead[0].Email.replace(/[^A-Za-z0-9@.[-]_]/g, '')}</CorreoElectronico>
            </Receptor>
            `;
    }
    
    xmlString += `
        <CondicionVenta>01</CondicionVenta>
        <MedioPago>${data.DocumentHead[0].TypePayment}</MedioPago>
        <DetalleServicio>`;
    
    for(let i = 0, l = 1; i < data.DocumentDetail.length; i++, l++) {
        xmlString += `
            <LineaDetalle>
                <NumeroLinea>${l}</NumeroLinea>
                <Codigo>${data.DocumentDetail[i].Code}</Codigo>
                <CodigoComercial>
                    <Tipo>04</Tipo>
                    <Codigo>${data.DocumentDetail[i].CodeReference}</Codigo>
                </CodigoComercial>
                <Cantidad>${data.DocumentDetail[i].Quantity}.00</Cantidad>
                <UnidadMedida>${data.DocumentDetail[i].UnidMeasure}</UnidadMedida>
                <Detalle>${data.DocumentDetail[i].ProductDescription}</Detalle>
                <PrecioUnitario>${data.DocumentDetail[i].Price}</PrecioUnitario>
                <MontoTotal>${data.DocumentDetail[i].SubTotal}</MontoTotal>`;
        if(data.DocumentDetail[i].Discount > 0) {
            xmlString += `
                <MontoDescuento>${data.DocumentDetail[i].Discount}</MontoDescuento>
                <NaturalezaDescuento>${data.DocumentDetail[i].DetailDiscount}</NaturalezaDescuento>`;
        }
        xmlString += `
                <SubTotal>${data.DocumentDetail[i].SubTotal}</SubTotal>
                <Impuesto>
                    <Codigo>01</Codigo>
                    <CodigoTarifa>08</CodigoTarifa>
                    <Tarifa>13.00</Tarifa>
                    <Monto>${data.DocumentDetail[i].SubTotal * 13}</Monto>
                </Impuesto>
                <MontoTotalLinea>${data.DocumentDetail[i].MontoTotalLinea}</MontoTotalLinea>
            </LineaDetalle>`;
    }
    
    xmlString += `
        </DetalleServicio>`;
    
    if(data.DocumentHead[0].TotalOtrosCargos != 0) {
        xmlString += `
        <OtrosCargos>
            <TipoDocumento>06</TipoDocumento>
            <Detalle>Impuesto de servicio 10%</Detalle>
            <Porcentaje>10.00</Porcentaje>
            <MontoCargo>${data.DocumentHead[0].TotalOtrosCargos}</MontoCargo>
        </OtrosCargos>`;
    }
    
    xmlString += `
        <ResumenFactura>
            <CodigoTipoMoneda>
                <CodigoMoneda>CRC</CodigoMoneda>
                <TipoCambio>1</TipoCambio>
            </CodigoTipoMoneda>
            <TotalServGravados>${data.DocumentHead[0].TotalServGravados}</TotalServGravados>
            <TotalMercanciasGravadas>${data.DocumentHead[0].TotalMercanciasGravadas}</TotalMercanciasGravadas>
            <TotalGravado>${data.DocumentHead[0].TotalGravado}</TotalGravado>
            <TotalVenta>${data.DocumentHead[0].TotalVenta}</TotalVenta>
            <TotalVentaNeta>${data.DocumentHead[0].TotalVentaNeta}</TotalVentaNeta>
            <TotalImpuesto>${data.DocumentHead[0].TotalImpuesto}</TotalImpuesto>
            <TotalOtrosCargos>${data.DocumentHead[0].TotalOtrosCargos}</TotalOtrosCargos>
            <TotalComprobante>${data.DocumentHead[0].TotalComprobante}</TotalComprobante>
        </ResumenFactura>`;
    
    xmlString += `</${data.footerDocument}>`;
    return xmlString;
}
  // Exporta la función para utilizarla en otras partes de tu aplicación
  module.exports = {
    generateXML,
  };
  