import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
export const CustomerDetails = ({ fila }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState(fila);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    setIsEditable(false);
    setFormData(fila);
  }, [fila]);

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleCancelEdit = () => {
    setIsEditable(false);
    setFormData(fila);
  };

  const handleDelete = () => {
    setIsEditable(false);
    setFormData(fila);
  };

  const handleSave = () => {
    // Aquí puedes hacer la llamada a la API para actualizar los datos
    // Por ejemplo: updateCustomerInDatabase(formData);

    setIsEditable(false);
  };

  return (
    <div className="">
    <form className="m-5 flex justify-evenly flex-wrap items-start gap-y-5">
      <div className="flex flex-col gap-3 w-[400px]">
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
            isEditable ? "  border-slate-400" : " border-white"
          }`}
        />
      </div>
      <div className="flex flex-col gap-3 w-[400px]">
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
            isEditable ? "  border-slate-400" : " border-white"
          }`}
        />
      </div>
      <div className="flex flex-col gap-3 w-[400px]">
        <label className="text-xl" htmlFor="dni">
          DNI:
        </label>
        <input
          type="text"
          name="dni"
          value={formData.dni}
          onChange={handleInputChange}
          disabled={!isEditable}
          className={`border p-2 rounded-lg w-full ${
            isEditable ? "  border-slate-400" : " border-white"
          }`}
        />
      </div>
      <div className="flex flex-col gap-3 w-[400px]">
        <label className="text-xl" htmlFor="email">
          Correo:
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={!isEditable}
          className={`border p-2 rounded-lg w-full ${
            isEditable ? "  border-slate-400" : " border-white"
          }`}
        />
      </div>
      <div className="flex flex-col gap-3 w-[400px]">
        <label className="text-xl" htmlFor="company_name">
          Nombre de la Empresa:
        </label>
        <input
          type="text"
          name="company_name"
          value={formData.company_name}
          onChange={handleInputChange}
          disabled={!isEditable}
          className={`border p-2 rounded-lg w-full ${
            isEditable ? "  border-slate-400" : " border-white"
          }`}
        />
      </div>
      <div className="flex flex-col gap-3 w-[400px]">
        <label className="text-xl" htmlFor="note">
          Nota:
        </label>
        <textarea
          className={`border p-2 rounded-lg w-full disabled:text-black disabled:opacity-100 ${
            isEditable ? "  border-slate-400" : " border-white "
          }`}
          name="note"
          value={formData.note}
          onChange={handleInputChange}
          disabled={!isEditable}
        />
      </div>
      <div className="flex flex-col gap-3 w-[400px]">
        <label className="text-xl" htmlFor="province">
          Provincia:
        </label>
        <select
            name="state"
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
      <div className="flex flex-col gap-3 w-[400px]">
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
            isEditable ? "  border-slate-400" : " border-white"
          }`}
        />
      </div>
      <div className="flex flex-col gap-3 w-[400px]">
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
            isEditable ? "  border-slate-400" : " border-white"
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
        <div>
          <button
            onClick={handleCancelEdit}
            className="bg-slate-400 text-white px-5 py-2 border rounded-full"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="bg-main-red mx-5 text-white px-5 py-2 border rounded-full"
          >
            Eliminar
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
