import React, { useState, useEffect } from "react";
import PopUp from "../../../components/popUp";
import CustomerSearch from "../../../components/CustomerSelect";
import { selectUser } from "../../../store/authSlice";
import { useSelector } from "react-redux";
import { haciendaService } from "../../../services/billingServices";
import { DniTypeService } from "../../../services/CustomerServices";

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
  const [errores, setErrores] = useState({
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
  }, [clientData, token]);

  const [isPopUpOpen, setPopUpOpen] = useState(false);

  const togglePopUp = () => {
    setPopUpOpen((prev) => !prev);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setClient((prev) => ({ ...prev, [name]: value }));
  };
  const handleDniNumber = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value.length >= 9) {
      haciendaService.getDNIinfo(value)
        .then((data) => {
          if (data && data.nombre && data.tipoIdentificacion) {
            // Actualiza los estados solo si la respuesta contiene los datos necesarios
            setFormData((prev) => ({
              ...prev,
              name: data.nombre,
              dni_type_id: data.tipoIdentificacion,
              customer_dni: value
            }));
            setClient((prev) => ({
              ...prev,
              name: data.nombre,
              dni_type_id: data.tipoIdentificacion,
              customer_dni: value
            }));
          } else {
            // Manejar el caso en que los datos no son los esperados
            setFormData((prev) => ({ ...prev, dni: value }));
            setClient((prev) => ({ ...prev, customer_dni: value }));
            console.error("La respuesta de la API no contiene los datos esperados.");
          }
        })
        .catch((error) => {
          // Aquí manejas el error
          if (error.response) {
            // Errores que vienen con una respuesta del servidor
            console.error("Error en la respuesta del servidor", error.response);
          } else if (error.request) {
            // Errores que ocurrieron al hacer la solicitud pero no se recibió respuesta
            console.error("La solicitud fue hecha pero no se recibió respuesta", error.request);
            if (error.code === 'ECONNABORTED') {
              // Manejo específico para el error de timeout
              console.error("La solicitud ha excedido el tiempo de espera. La API de Hacienda puede estar caída o muy lenta.");
            }
          } else {
            // Errores generados durante la configuración de la solicitud
            console.error("Error en la configuración de la solicitud", error.message);
          }
        });
    }
    
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
          <label>Tipo de DNI:</label>
          <select
            className="input-text"
            name="dni_type_id"
            value={formData.dni_type_id}
            onChange={handleInputChange}
          >
            <option value="">Selecciona un tipo</option>
            {dniTypes.map((dniType) => (
              <option key={dniType.codigo} value={dniType.codigo}>
                {dniType.tipoIdentificacion}
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
            onChange={handleDniNumber}
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


