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
  console.log(formData);
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
    <div className="p-10 my-5 rounded-main bg-white border shadow">
      <h2 className="text-2xl text-main-blue mb-8">Detalles</h2>
      <form className="flex justify-between flex-wrap items-start gap-5 w-full">
        <div className="flex flex-col gap-3">
          <label className="text-xl" htmlFor="name">
            Nombre:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`input-text `}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xl" htmlFor="lastname">
            Apellido:
          </label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`input-text `}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xl" htmlFor="dni">
            Identificación:
          </label>
          <input
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`input-text`}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xl" htmlFor="email">
            Correo:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`input-text `}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xl" htmlFor="company_name">
            Nombre de la Empresa:
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`input-text `}
          />
        </div>
        <div className="flex gap-5 flex-wrap">
          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="province">
              Provincia:
            </label>
            <select
              name="state"
              value={formData.province}
              onChange={handleInputChange}
              disabled={!isEditable}
              className={`input-text $`}
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
          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="canton">
              Cantón:
            </label>
            <input
              type="text"
              name="canton"
              value={formData.canton}
              onChange={handleInputChange}
              disabled={!isEditable}
              className={`input-text `}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xl" htmlFor="district">
              Distrito:
            </label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              disabled={!isEditable}
              className={`input-text `}
            />
          </div>
          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="exact_address">
              Dirección Exacta:
            </label>
            <textarea
              className={`input-text `}
              name="exact_address"
              value={formData.exact_address}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>

        </div>
        <div className="flex flex-col gap-3">
            <label className="text-xl" htmlFor="note">
              Nota:
            </label>
            <textarea
              className={`input-text `}
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>
      </form>
      <div className="flex justify-end gap-8 mt-5">
        {!isEditable ? (
          <button onClick={handleEdit} className="button-success">
            Editar
          </button>
        ) : (
          <div>
            <button onClick={handleCancelEdit} className="button-cancel">
              Cancelar
            </button>
            <button onClick={handleDelete} className="button-delete">
              Eliminar
            </button>
            <button onClick={handleSave} className="button-success">
              Guardar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
