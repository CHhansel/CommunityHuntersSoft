import React from 'react';
import './InvoicePreview.css'; 

// eslint-disable-next-line react/prop-types
const InvoicePreview = ({emisor, factura}) => {
  // Datos de prueba


  return (
    <div className="invoice-preview">
      <header className='flex flex-col text-center'>
      {emisor.mostrarLogo && emisor.logo && (
        <div className="flex flex-col justify-center items-center">
          <img src={URL.createObjectURL(emisor.logo)} alt="Logo" style={{ maxWidth: '150px' }} />
        </div>
      )}

        <h1>{emisor.NombreComercial}</h1>
        <p>{emisor.nombre}</p>
        <p>Ced Jur: {emisor.identificacion}</p>
        <p>{emisor.Provincia}, {emisor.direccionExacta}</p>
        <p>{emisor.codigoTelefono} {emisor.Telefono}</p>
        <p>{emisor.correo}</p>
      </header>

      <section>

        <p className='w-100 break-number mb-2'>Tiquete electrónico: {factura.KeyXml}</p>
        {/* <p>Número Consecutivo: {factura.Consecutivo}</p> */}
        <p> {factura.Fecha}</p>
        <p>Método de Pago: {factura.MedioDePago}</p>
      </section>

      <section className="table">
        <div className="thead">
          <div className="tr"><div className="sep"></div></div>
          <div className="tr">
            <div className="th" style={{ width: "60%" }}>Descripción</div>
            <div className="th" style={{ width: "40%" }}>Código</div>
          </div>
          <div className="tr">
            <div className="th" style={{ width: "35%" }}>Precio</div>
            <div className="th" style={{ width: "15%" }}>Cant.</div>
            <div className="th" style={{ width: "35%" }}>Total</div>
            <div className="th" style={{ width: "15%" }}>IVA</div>
          </div>
          <div className="tr"><div className="sep"></div></div>
        </div>
        <div className="tbody">
          {factura.LineaDeDetalle.map((item, index) => (
            <React.Fragment key={index}>
              <div className="tr">
                <div className="td" style={{ width: "60%" }}>{item.description}</div>
                <div className="td" style={{ width: "40%" }}>{item.internal_code}</div>
              </div>
              <div className="tr">
                <div className="td" style={{ width: "35%" }}>{item.price}</div>
                <div className="td" style={{ width: "15%" }}>x{item.quantity}</div>
                <div className="td" style={{ width: "35%" }}>{(item.quantity * item.price).toFixed(2)}</div>
                <div className="td" style={{ width: "15%" }}>{item.tax_rate}%</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      <footer>
        {/* Aquí puedes agregar la lógica para Otros Cargos y mensajes personalizados */}
        <p className="center">Emitida conforme lo establecido por la resoliución NO DGT-R-033-2019 del 27 de junio del 2019</p>
        <p className="center">Version 4.3</p>
        <p className="center mt-5 mb-5">{emisor.mensaje1}</p>
        <p className="center mb-5">{emisor.mensaje2}</p>
        <p className="center mb-5">{emisor.mensaje3}</p>
      </footer>
    </div>
  );
};

export default InvoicePreview;
