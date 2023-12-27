import { useEffect, useState } from "react";
import InvoicePreview from "./InvoicePreview";
import { selectUser } from "../../../store/authSlice";
import { useSelector } from "react-redux";
import { CompanyDataService } from "../../../services/companyServices";

const InvoiceCustomization = () => {
  const { user, token } = useSelector(selectUser);
  const [formData, setFormData] = useState({
    mensaje1: "",
    mensaje2: "",
    mensaje3: "",
    mostrarLogo: false,
    logo: null,
  });
  useEffect(() => {
    CompanyDataService.getCompanyDataById(user.company_id).then((data) => {
      console.log(data);
      setEmisor((prevState) => ({
        ...prevState,
        NombreComercial: data.trade_name,
        nombre: data.name,
        identificacion: data.identification_number,
       // Provincia: data.province,
         direccionExacta: data.exact_address,
         Telefono: data.phone,
         correo: data.email,
         
      }));
    });

  }, []);

  const [emisor, setEmisor] = useState({
    NombreComercial: "Nombre Comercial",
    nombre: "Nombre del Emisor",
    identificacion: "123456789",
    Provincia: "San José",
    Canton: "Central",
    Distrito: "Carmen",
    direccionExacta: "Calle 123, Avenida 456",
    codigoTelefono: "+506",
    Telefono: "12345678",
    correo: "correoComercio@mail.com",
    mensaje1: "",
    mensaje2: "",
    mensaje3: "",
    mostrarLogo: false,
    logo: null,
  });
  const date= Date.now();
  const factura = {
    KeyXml: "50623122300011693011400100001010032222222158379673",
    Consecutivo: "00100001010033222222",
    Fecha: new Date().toLocaleString(),
    CondicionDeVenta: "Condición de venta",
    MedioDePago: "Efectivo",
    LineaDeDetalle: [
      {
        description: "Producto 1",
        internal_code: "001",
        price: 1000,
        quantity: 2,
        tax_rate: 13,
      },
      {
        description: "Producto 2",
        internal_code: "002",
        price: 2000,
        quantity: 1,
        tax_rate: 13,
      },
      // Más productos...
    ],
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmisor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setEmisor((prevState) => ({
      ...prevState,
      mostrarLogo: e.target.checked,
    }));
  };

  const handleLogoChange = (e) => {
    setEmisor((prevState) => ({
      ...prevState,
      logo: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí se manejaría la lógica para procesar los datos del formulario
    console.log(formData);
    alert("Configuración de factura guardada exitosamente");
  };

  return (
    <div className="p-10 my-5 rounded-main bg-white border shadow flex justify-around">
      <div className="">
        <h2 className="mb-5">Personalización de Factura</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-between flex-wrap items-start gap-5 w-full"
        >
          {/* Mensajes Personalizados */}
          <div className="flex flex-col gap-3">
            <label>Mensaje Personalizado 1:</label>
            <textarea
              className="input-text"
              name="mensaje1"
              value={emisor.mensaje1}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label>Mensaje Personalizado 2:</label>
            <textarea
              className="input-text"
              name="mensaje2"
              value={emisor.mensaje2}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label>Mensaje Personalizado 3:</label>
            <textarea
              className="input-text"
              name="mensaje3"
              value={emisor.mensaje3}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* Opción para mostrar logo */}
          <div className="flex flex-col gap-3">
            <label>
              <input
                type="checkbox"
                name="mostrarLogo"
                checked={emisor.mostrarLogo}
                onChange={handleCheckboxChange}
              />
              Mostrar Logo
            </label>
          </div>

          {/* Cargar logo */}
          {emisor.mostrarLogo && (
            <div className="flex flex-col gap-3">
              <label>Logo de la Empresa:</label>
              <input type="file" onChange={handleLogoChange} />
            </div>
          )}

          {/* Botón de envío */}
          <div>
            <button className="mt-12 button-success" type="submit">
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
      <div className="flex flex-col text-center">
        <h4>Su factura se vera así:</h4>

        <InvoicePreview factura={factura} emisor={emisor}></InvoicePreview>
      </div>
    </div>
  );
};

export default InvoiceCustomization;
