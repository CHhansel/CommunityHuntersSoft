function generateXML(data) {
    let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
    <${data.headDocument}>
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
                    <Monto>${data.DocumentDetail[i].Impuesto}</Monto>
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


let data = {
    headDocument: 'Documento',
    footerDocument: 'Documento',
    KeyXml: '123456',
    DataEmisor: [{
        CodeActivity: '78910',
        Name: 'Nombre Emisor',
        TypeIdentification: '01',
        IdentificationNumber: '112233',
        TradeName: 'Nombre Comercial',
        Province: 'Provincia',
        Canton: 'Canton',
        District: 'Distrito',
        Address: 'Dirección',
        CodePhone: '506',
        Phone: '12345678',
        Email: 'email@example.com'
    }],
    Consecutive: '123456789',
    DateDocument: '2023-10-28T12:34:56',
    DocumentHead: [{
        TypeIdentification: '02',
        IdentificationNumber: '445566',
        NameClient: 'Nombre Cliente',
        Email: 'client@example.com',
        TypePayment: '01',
        TotalServGravados: '100.00',
        TotalMercanciasGravadas: '200.00',
        TotalGravado: '300.00',
        TotalVenta: '400.00',
        TotalVentaNeta: '500.00',
        TotalImpuesto: '60.00',
        TotalOtrosCargos: '10.00',
        TotalComprobante: '570.00'
    }],
    DocumentDetail: [{
        Code: '001',
        CodeReference: 'A001',
        Quantity: '10',
        UnidMeasure: 'kg',
        ProductDescription: 'Producto 1',
        Price: '10.00',
        SubTotal: '100.00',
        Discount: '10.00',
        DetailDiscount: 'Descuento aplicado',
        Impuesto: '13.00',
        MontoTotalLinea: '103.00'
    }, {
        Code: '002',
        CodeReference: 'A002',
        Quantity: '20',
        UnidMeasure: 'lt',
        ProductDescription: 'Producto 2',
        Price: '5.00',
        SubTotal: '100.00',
        Discount: '0',
        DetailDiscount: '',
        Impuesto: '13.00',
        MontoTotalLinea: '113.00'
    }]
};


  // Exporta la función para utilizarla en otras partes de tu aplicación
  module.exports = {
    generateXML,
  };
  