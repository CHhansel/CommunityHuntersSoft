import { useEffect, useRef, useState } from "react";
import { CompanyCredentialsService } from "../../../services/companyServices";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/authSlice";
import { useCertificateUpload } from "../../../hooks/files/useCertificateUpload";

const CompanySettings = () => {
  const { user } = useSelector(selectUser);
  const [formData, setFormData] = useState({
    pinCertificado: "",
    usuarioATV: "",
    passwordATV: "",
    client_id: "",
    client_secret: "",
    company_id: user.company_id,
  });
  const { uploadCertificate, isLoading, error } = useCertificateUpload();
  const [credentialsExist, setCredentialsExist] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const checkCredentials = async () => {
      try {
        const status =
          await CompanyCredentialsService.getCredentialsByCompanyId(
            user.company_id
          );
        console.log(status);
        setCredentialsExist(status);
      } catch (error) {
        console.error("Error al verificar las credenciales:", error);
      }
    };

    checkCredentials();
  }, [user.company_id]);
  const handleUpload = async () => {
    const fileData = fileInputRef.current.files[0];
    const companyId = 1; // Asegúrate de obtener este valor según tu lógica de aplicación
    await uploadCertificate(fileData, companyId);
  };
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
      <h2 className="text-2xl text-main-blue mb-8">
        Formulario de Credenciales de Compañía
      </h2>
      <div className="flex  flex-row items-center gap-7">
        <button className="mt-12 mb-12 button-success">
          Para ver como obtener las credenciales click aquí
        </button>
        {credentialsExist == 0 && <>Aun no ha registrado sus datos de ATV</>}
        {credentialsExist == 1 && <>Ya ha registrado sus datos de ATV</>}
      </div>
      <form
        autoComplete="off"
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
          <label>Usuario ATV:</label>
          <input
            className="input-text"
            type="text"
            name="usuarioATV"
            value={formData.usuarioATV}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Contraseña ATV:</label>
          <input
            className="input-text"
            type="password"
            name="passwordATV"
            value={formData.passwordATV}
            onChange={handleChange}
            autoComplete="new-password"
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

        <div className="">
          {credentialsExist == 0 && (
            <button className="mt-12  button-success" type="submit">
              Guardar Credenciales
            </button>
          )}
          {credentialsExist == 1 && (
            <button className="mt-12  button-success" type="submit">
              Actualizar Credenciales
            </button>
          )}
        </div>
      </form>
      {credentialsExist == 1 && (
        <div className="mt-10">
          <input type="file" ref={fileInputRef} disabled={isLoading} />
          {isLoading && <p>Cargando...</p>}
          {error && <p>Error: {error}</p>}
          <button onClick={handleUpload} disabled={isLoading} className="button-success">
            Subir Certificado
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanySettings;
