import { useEffect, useState } from "react";
import ClientData from "./ClientData";
import CabysSearch from "../../components/cabys";
import PopUp from "../../components/popUp";

import PropertyData from "./PropertyData";
import BillData from "./BillData";

const Billing = () => {

const [lines, setLines] = useState([]);

const [client, setclient] = useState({});
const [property, setProperty] = useState({});
const [cabys, setCabys] = useState();
const [isPopUpOpen, setPopUpOpen] = useState(false);


useEffect(() => {
  console.log(property);


}, [property])


const togglePopUp = () => {
  setPopUpOpen(prev => !prev);
} 
  return (
    
    <div className="w-full px-16 flex flex-col justify-start h-full ">
      <h4>1. Informacion del Cliente</h4>
      <button onClick={togglePopUp}>Mostrar PopUp</button>
      <PopUp isOpen={isPopUpOpen} onClose={togglePopUp}>
        <CabysSearch setCabys={setCabys}></CabysSearch>
      </PopUp>
      <ClientData setClient={setclient}/>
      <h4>2. Lineas de detalle</h4>
      <PropertyData setProperty={setProperty}></PropertyData>
      <h4>3. Datos de Factura</h4>
      <BillData property={property}></BillData>
    </div>
  )
}

export default Billing