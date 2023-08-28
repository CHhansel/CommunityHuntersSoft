import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
export const PropertyDetail = ({ fila }) => {
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
    // Por ejemplo: updateDataInDatabase(formData);

    setIsEditable(false);
  };

  return (
    <div className="border mt-5 p-5">
      <form className="flex gap-10 flex-wrap">
        <div className="mb-4">
          <label className="text-lg block font-bold mb-2" htmlFor="name">
            Nombre:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`w-72 px-4 py-2 border ${
              isEditable ? "  border-slate-400" : " border-white"
            }`}
          />
        </div>
        <div className="">
          <label className="text-lg block font-bold mb-2" htmlFor="description">
            Descripción:
          </label>
          <textarea
            className={`min-w-[288px] min-h-[100px] px-4 py-2 border disabled:text-black disabled:opacity-100 ${
              isEditable ? "  border-slate-400" : " border-white "
            }`}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            disabled={!isEditable}
          />
        </div>
        <div>
          <label className="text-lg block font-bold mb-2" htmlFor="state">
            Estado:
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`w-72 px-4 py-2 border disabled:text-black disabled:opacity-100 ${
              isEditable
                ? "bg-white  border-slate-400"
                : "bg-input border-white "
            }`}
          >
            <option value="Disponible">Disponible</option>
            <option value="Ocupado">Ocupado</option>
            <option value="Mantenimiento">Mantenimiento</option>
          </select>
        </div>
        <div>
          <label className="text-lg block font-bold mb-2" htmlFor="province">
            Provincia:
          </label>
          <select
            name="state"
            value={formData.province}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`w-72 px-4 py-2 border disabled:text-black disabled:opacity-100 ${
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
        <div className="mb-4">
          <label className="text-lg block font-bold mb-2" htmlFor="canton">
            Cantón:
          </label>
          <input
            type="text"
            name="canton"
            value={formData.canton}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`w-72 px-4 py-2 border ${
              isEditable ? "  border-slate-400" : " border-white"
            }`}
          />
        </div>

        <div className="mb-4">
          <label className="text-lg block font-bold mb-2" htmlFor="district">
            Distrito:
          </label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`w-72 px-4 py-2 border ${
              isEditable ? "  border-slate-400" : " border-white"
            }`}
          />
        </div>
        <div className="">
          <label
            className="text-lg block font-bold mb-2"
            htmlFor="exactAddress"
          >
            Dirección Exacta:
          </label>
          <textarea
            className={`min-w-[288px] min-h-[100px] px-4 py-2 border disabled:text-black disabled:opacity-100 ${
              isEditable ? "  border-slate-400" : " border-white "
            }`}
            name="exactAddress"
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
              Guardar
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
