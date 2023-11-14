import { useState } from "react";
import { CompanyCredentialsService } from "../../../services/companyServices";

const CompanySettings = () => {
  const [formData, setFormData] = useState({
    pinCertificado: "",
    usuario: "",
    password: "",
    client_id: "",
    client_secret: "",
    company_id: "",
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
      const response = await CompanyCredentialsService.createCredentials(
        formData
      );
      console.log(response);
      alert("Credenciales creadas exitosamente");
    } catch (error) {
      console.error("Error al crear las credenciales:", error);
      alert("Error al crear las credenciales");
    }
  };

  return (
    <div className="p-10 my-5 rounded-main bg-white border shadow">
      <h2>Formulario de Credenciales de Compañía</h2>
      <button className="mt-12 mb-12 button-success">Para ver como obtener las credenciales click aquí</button>
      <form
        onSubmit={handleSubmit}
        className=" flex justify-between flex-wrap items-start gap-5 w-full"
      >
        <div className="flex flex-col gap-3">
          <label>Pin Certificado:</label>
          <input
          className="input-text"
            type="text"
            name="pinCertificado"
            value={formData.pinCertificado}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Usuario:</label>
          <input
          className="input-text"
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3">

          <label>Contraseña:</label>
          <input
          className="input-text"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3">

          <label>Client ID:</label>
          <input
          className="input-text"
            type="text"
            name="client_id"
            value={formData.client_id}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3">

          <label>Client Secret:</label>
          <input
          className="input-text"
            type="text"
            name="client_secret"
            value={formData.client_secret}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3">

          <label>Company ID:</label>
          <input
          className="input-text"
            type="number"
            name="company_id"
            value={formData.company_id}
            onChange={handleChange}
          />
        </div>
        <div>
          <button className="mt-12  button-success" type="submit">Guardar Credenciales</button>
        </div>
      </form>
    </div>
  );
};

export default CompanySettings;

