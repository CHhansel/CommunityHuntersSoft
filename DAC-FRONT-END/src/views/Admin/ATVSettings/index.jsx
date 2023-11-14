import { useState } from "react";
import { CompanyService } from "../../../services/companyServices"; // Asegúrate de usar la ruta correcta

const ATVSettings = () => {
  const [formData, setFormData] = useState({
    name: "",
    legal_name: "",
    trade_name: "",
    identification_type: "",
    identification_number: "",
    phone: "",
    fax: "",
    email: "",
    economic_activity: "",
    tax_regime: "",
    status: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await CompanyService.updateCompany(formData.id, formData);
      console.log(response);
      alert("Compañía actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar la compañía:", error);
      alert("Error al actualizar la compañía");
    }
  };

  return (
    <div className="p-10 my-5 rounded-main bg-white border shadow">
      <h2>Formulario de Actualización de Compañía</h2>
      <form
        onSubmit={handleSubmit}
        className="flex justify-between flex-wrap items-start gap-5 w-full"
      >
        <div className="flex flex-col gap-3">
          <label>Nombre:</label>
          <input
          className="input-text"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Nombre Legal:</label>
          <input
          className="input-text"
            type="text"
            name="legal_name"
            value={formData.legal_name}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Nombre Comercial:</label>
          <input
          className="input-text"
            type="text"
            name="trade_name"
            value={formData.trade_name}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Tipo de Identificación:</label>
          <input
          className="input-text"
            type="text"
            name="identification_type"
            value={formData.identification_type}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Número de Identificación:</label>
          <input
          className="input-text"
            type="text"
            name="identification_number"
            value={formData.identification_number}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Teléfono:</label>
          <input
          className="input-text"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Fax:</label>
          <input
          className="input-text"
            type="text"
            name="fax"
            value={formData.fax}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Email:</label>
          <input
          className="input-text"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Actividad Económica:</label>
          <input
          className="input-text"
            type="text"
            name="economic_activity"
            value={formData.economic_activity}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Régimen Tributario:</label>
          <input
          className="input-text"
            type="text"
            name="tax_regime"
            value={formData.tax_regime}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Estado:</label>
          <select
          className="input-text"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
        </div>
        <div>
          <button className="mt-12 button-success" type="submit">Actualizar Compañía</button>
        </div>
      </form>
    </div>
  );
};

export default ATVSettings;

