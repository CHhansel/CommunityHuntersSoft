import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/authSlice";


const UserConfig = () => {
  const { user } = useSelector(selectUser);
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleCancelEdit = () => {
    setIsEditable(false);
    setFormData(user);
  };

  const handleSave = () => {
    // Aquí puedes llamar a la función que actualiza la información del usuario en la base de datos
    // Por ejemplo: dispatch(updateUserInfo(formData, token));

    setIsEditable(false);
  };

  return (
    <div className="border border-black p-5 my-5">
      <h2 className="text-2xl text-main-blue mb-8">Configuración de Usuario</h2>
      <form className="m-5 flex flex-row max-w-[750px]  justify-between flex-wrap items-start gap-y-5">
        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl" htmlFor="user_name">
            Usuario:
          </label>
          <input
            type="text"
            name="user_name"
            value={formData.user_name}
            onChange={handleInputChange}
            disabled={true}
            className={`border p-2 rounded-lg w-full `}
          />
        </div>
        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl" htmlFor="email">
            correo:
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={true}
            className={`border p-2 rounded-lg w-full `}
          />
        </div>
        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl" htmlFor="name">
            Nombre:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : ""
            }`}
          />
        </div>
        {/* Puedes continuar con otros campos de la misma manera... */}
        {/* Por ejemplo: */}
        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl" htmlFor="lastname">
            Apellido:
          </label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : ""
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl" htmlFor="company_name">
            Compañia:
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : ""
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl" htmlFor="phone_number">
            Telefono:
          </label>
          <input
            type="number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : ""
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl" htmlFor="fax_number">
            Número Fax:
          </label>
          <input
            type="number"
            name="fax_number"
            value={formData.fax_number}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : ""
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl" htmlFor="fax_number">
            Número Fax:
          </label>
          <input
            type="text"
            name="fax_number"
            value={formData.fax_number}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : ""
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl" htmlFor="province">
            Provincia:
          </label>
          <select
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full disabled:text-black disabled:opacity-100 ${
              isEditable
                ? "bg-white  border-slate-400"
                : "bg-input border-white "
            }`}
          >
            <option value="San José">San José</option>
            <option value="Alajuela">Alajuela</option>
            <option value="Cartago">Cartago</option>
            <option value="Heredia">Heredia</option>
            <option value="Guanacaste">Guanacaste</option>
            <option value="Puntarenas">Puntarenas</option>
            <option value="Limón">Limón</option>
          </select>
        </div>
        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl" htmlFor="canton">
            Cantón:
          </label>
          <input
            type="text"
            name="canton"
            value={formData.canton}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : ""
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl" htmlFor="district">
            Distrito:
          </label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : ""
            }`}
          />
        </div>
                <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl" htmlFor="district">
            Distrito:
          </label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : ""
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[400px]">
            <label className="text-xl" htmlFor="exact_address">
              Dirección Exacta:
            </label>
            <textarea
              className={`border p-2 rounded-lg w-full disabled:text-black disabled:opacity-100 ${
                isEditable ? "  border-slate-400" : " border-white "
              }`}
              name="exact_address"
              value={formData.exact_address}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>
      </form>
      <div className="flex justify-end gap-8">
        {!isEditable ? (
          <button
            onClick={handleEdit}
            className="bg-main-blue text-white px-5 py-2 border rounded-full"
          >
            Editar
          </button>
        ) : (
          <div className="">
            <button
              onClick={handleCancelEdit}
              className="bg-slate-400 mx-5 text-white px-5 py-2 border rounded-full"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="bg-main-blue text-white px-5 py-2 border rounded-full"
            >
              Guardar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserConfig;
