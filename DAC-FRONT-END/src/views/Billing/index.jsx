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
  const [companyInfo, setCompanyInfo] = useState({});
  const [cabys, setCabys] = useState();
  const [isPopUpOpen, setPopUpOpen] = useState(false);

  useEffect(() => {
    console.log("property: ", property, " client: ", client);
  }, [property, client]);

  const togglePopUp = () => {
    setPopUpOpen((prev) => !prev);
  };

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
      client: {
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

    // Aquí puedes enviar estos datos al backend.
    // Por ejemplo, usando fetch o Axios para hacer una solicitud POST.
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
      <BillData property={property}></BillData>
      <div>
        <button className="button-success" onClick={()=>prepareInvoiceData()}>Facturar</button>
      </div>
    </div>
  );
};

export default Billing;
