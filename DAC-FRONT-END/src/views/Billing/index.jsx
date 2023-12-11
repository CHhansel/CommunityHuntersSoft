import { useEffect, useState } from "react";
import ClientData from "./ClientData";
import CabysSearch from "../../components/cabys";
import PopUp from "../../components/popUp";

import PropertyData from "./PropertyData";
import BillData from "./BillData";

const Billing = () => {
  const [lines, setLines] = useState([]);

  const [client, setClient] = useState({});
  const [property, setProperty] = useState({});
  const [billParams, setBillParams] = useState({});
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
      "cabys_code": "12345",
      "unit_of_measure": "Unidad",
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
      "cabys_code": "67890",
      "unit_of_measure": "Paquete",
      "tax_rate": 0.00,
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
      "cabys_code": "54321",
      "unit_of_measure": "Caja",
      "tax_rate": 13.00,
      "created_at": "2023-12-08T12:00:00",
      "updated_at": "2023-12-08T12:00:00"
    }
  ];
  const prepareInvoiceData = () => {
    const invoiceData = {
      property: {
        id: property.id,
        rentAmount: property.rent_amount,
        depositAmount: property.deposit_amount,
        description: property.description,
        startDate: property.start_date,
        endDate: property.end_date,
        taxAmount: property.tax_amount,
        totalAmount: property.total_amount,
      },
      receptor: {
        id: client.customer_id,
        name: client.name,
        lastname: client.lastname,
        dniType: client.dni_type_description,
        customerDni: client.customer_dni,
      },
      paymentDetails: {
        issueDate: property.creation_date,
        paymentDate: property.payment_date,
        paymentMethod: property.payment_method,
      },
    };


    console.log(invoiceData);
    return invoiceData;
  };
  return (
    <div className="w-full px-16 flex flex-col justify-start h-full ">
      <h4>1. Informacion del Cliente</h4>
      <button onClick={togglePopUp}>Mostrar PopUp</button>
      <PopUp isOpen={isPopUpOpen} onClose={togglePopUp}>
        <CabysSearch setCabys={setCabys}></CabysSearch>
      </PopUp>
      <ClientData clientData={client} setClient={setClient} />
      <h4>2. Lineas de detalle</h4>
      <PropertyData setProperty={setProperty}></PropertyData>
      <h4>3. Datos de Factura</h4>
      <BillData products={products} setBillParams="setBillParams"></BillData>
      <div>
        <button className="button-success" onClick={()=>prepareInvoiceData()}>Facturar</button>
      </div>
    </div>
  );
};

export default Billing;
