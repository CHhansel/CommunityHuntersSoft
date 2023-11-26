import React, { useState, useEffect } from "react";
import PopUp from "../../../components/popUp";
import CustomerSearch from "../../../components/CustomerSelect";
import { DniTypeService } from "../../../services/customerService"; // As
import { selectUser } from "../../../store/authSlice";
import { useSelector } from "react-redux";

const ClientData = ({ clientData, setClient }) => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    dni: "",
    email: "",
    province: "",
    canton: "",
    district: "",
    exactAddress: "",
    dni_type_id: "",
  });
  const [dniTypes, setDniTypes] = useState([]); // Estado para almacenar los tipos de DNI

  const { token } = useSelector(selectUser);
  useEffect(() => {
    if (clientData) {
      setFormData(clientData);
      console.log("cliente recibido es ", clientData);
    }
    // Obtener tipos de DNI
    const loadDniTypes = async () => {
      try {
        const data = await DniTypeService.getDniTypes(token); // Reemplaza yourAuthToken por tu token
        setDniTypes(data.dniTypes);
      } catch (error) {
        console.error("Error al cargar los tipos de DNI:", error);
      }
    };
    loadDniTypes();
  }, [clientData]);

  const [isPopUpOpen, setPopUpOpen] = useState(false);

  const togglePopUp = () => {
    setPopUpOpen((prev) => !prev);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setClient(formData);
  };
  return (
    <div className="p-10 my-5 rounded-main bg-white border shadow">
      <button className="my-5 button-success" onClick={togglePopUp}>
        Buscar Cliente
      </button>
      <PopUp isOpen={isPopUpOpen} onClose={togglePopUp}>
        <CustomerSearch setCustomer={setFormData}></CustomerSearch>
      </PopUp>
      <form className="flex justify-between flex-wrap items-start gap-5 w-full">
        <div className="flex flex-col gap-3">
          <label>Nombre:</label>
          <input
            className="input-text"
            type="text"
            name="name"
            value={formData.name}

            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Apellidos:</label>
          <input
            className="input-text"
            type="text"
            name="lastname"
            value={formData.lastname}
  
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Tipo de DNI:</label>
          <select
            className="input-text"
            name="dni_type_id"
            value={formData.dni_type_id}
            onChange={handleInputChange}
          >
            <option value="">Selecciona un tipo</option>
            {dniTypes.map((dniType) => (
              <option key={dniType.id} value={dniType.id}>
                {dniType.code}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-3">
          <label>Identificación:</label>
          <input
            className="input-text"
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Email:</label>
          <input
            className="input-text"
            type="email"
            name="email"
            value={formData.email}

            onChange={handleInputChange}
          />
        </div>
      </form>
    </div>
  );
};

export default ClientData;
