import { useEffect, useState } from "react";
import ClientData from "./ClientData";
import CabysSearch from "../../components/cabys";
import PopUp from "../../components/popUp";

import PropertyData from "./PropertyData";
import BillData from "./BillData";
import { selectUser } from "../../store/authSlice";
import { useSelector } from "react-redux";
import { invoiceService } from "../../services/billingServices";

const Billing = () => {
  const { user, token } = useSelector(selectUser);
  const [lines, setLines] = useState([]);

  const [client, setClient] = useState({});
  const [property, setProperty] = useState({});
  //const [billParams, setBillParams] = useState({});
  const [payCondition, setpayCondition] = useState("01");
  const [paymentMethod, setpaymentMethod] = useState("01")
  const [companyInfo, setCompanyInfo] = useState({});
  const [cabys, setCabys] = useState();
  const [isPopUpOpen, setPopUpOpen] = useState(false);

  useEffect(() => {
    console.log("property: ", property, " client: ", client);
  }, [property, client]);

  const togglePopUp = () => {
    setPopUpOpen((prev) => !prev);
  };
  const products = [
    {
      "internal_code": "ABC123",
      "name": "Producto 1",
      "description": "Descripción del Producto 1",
      "product_type": "Tipo 1",
      "price": 100.00,
      "quantity": 1,
      "cabys_code": "0111100009900",
      "unit_of_measure": "Unid",
      "tax_rate": 13.00,
      "created_at": "2023-12-08T12:00:00",
      "updated_at": "2023-12-08T12:00:00"
    },
    {
      "internal_code": "DEF456",
      "name": "Producto 2",
      "description": "Descripción del Producto 2",
      "product_type": "Tipo 2",
      "price": 200.00,
      "quantity": 1,
      "cabys_code": "0111100009900",
      "unit_of_measure": "Unid",
      "tax_rate": 13.00,
      "created_at": "2023-12-08T12:00:00",
      "updated_at": "2023-12-08T12:00:00"
    },
    {
      "internal_code": "GHI789",
      "name": "Producto 3",
      "description": "Descripción del Producto 3",
      "product_type": "Tipo 3",
      "price": 50.00,
      "quantity": 1,
      "cabys_code": "0111100009900",
      "unit_of_measure": "Unid",
      "tax_rate": 13.00,
      "created_at": "2023-12-08T12:00:00",
      "updated_at": "2023-12-08T12:00:00"
    }
  ];
  const prepareInvoiceData = () => {
    const invoiceData = {
      company_id: user.company_id,
      Cliente: {
        id: client.customer_id,
        nombre: client.name,
        tipoIdentificacion: client.dni_type_id,
        idenficacion: client.customer_dni,
        email: client.email
      },
      CondicionDeVenta: payCondition,
      MedioDePago: paymentMethod,
      LineaDeDetalle: products
    };


    console.log(invoiceData);
    return invoiceData;
  };

  const invoice = async e => {
    //e.preventDefault();
    try {

      // Prepara los datos de la factura
      const invoiceData = prepareInvoiceData();
  
      // Llama al servicio de facturación y espera por la respuesta
      const response = await invoiceService.createInvoice(token, invoiceData);
      
      console.log('Factura creada con éxito', response);
  
      // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
    } catch (error) {
      console.error('Error al crear la factura', error);
      // Aquí podrías manejar el error, por ejemplo, mostrar un mensaje al usuario
    }

  } 
  return (
    <div className="w-full px-16 flex flex-col justify-start h-full ">
      <h4>1. Informacion del Cliente</h4>

      <ClientData clientData={client} setClient={setClient} />
      <h4>2. Lineas de detalle</h4>
      <PropertyData setProperty={setProperty}></PropertyData>
      <h4>3. Datos de Factura</h4>
      <BillData products={products} setpayCondition={setpayCondition} setpaymentMethod={setpaymentMethod}></BillData>
      <div>
        <button className="button-success" onClick={()=>invoice()}>Facturar</button>
      </div>
    </div>
  );
};

export default Billing;
