import { useEffect, useState } from "react";
import { updatePropertyAction } from "../../../actions/properties";
import { selectUser } from "../../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { ContractDetail } from "../ContractDetails";
import { ContractCreate } from "../ContractCreate";


// eslint-disable-next-line react/prop-types
export const PropertyDetail = ({ fila }) => {
  const { user, token } = useSelector(selectUser);
  const [isEditable, setIsEditable] = useState(false);
  // eslint-disable-next-line react/prop-types
  const existContract = (fila.state == "Ocupado")? true: false;

  const [formData, setFormData] = useState({ ...fila, user_id: user.id });
  
  const dispatch = useDispatch();
  const [contratoViewActive, setcontratoViewActive] = useState(false)
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  useEffect(() => {
    setIsEditable(false);
    setcontratoViewActive(false);
    setFormData({ ...fila, user_id: user.id });
  }, [fila, user.id]);

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
    try {
      dispatch(updatePropertyAction({ data: formData, token }));
      alert("Propiedad creada con éxito!");
    } catch (error) {
      console.error("Hubo un error al crear la propiedad:", error);
      alert("Error al crear propiedad. Por favor, inténtalo de nuevo.");
    }

    setIsEditable(false);
  };

  return (
    <div>
      <div className="border border-black my-5 p-5">
        <h2 className="text-2xl text-main-blue mb-8">Detalles de Propiedad</h2>
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
                isEditable ? "  border-slate-400" : " "
              }`}
            />
          </div>
          <div className="flex flex-col gap-3 w-[400px]">
            <label className="text-xl" htmlFor="description">
              Descripción:
            </label>
            <textarea
              className={`border p-2 rounded-lg w-full disabled:text-black disabled:opacity-100 ${
                isEditable ? "  border-slate-400" : " border-white "
              }`}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>
          <div className="flex flex-col gap-3 w-[200px]">
            <label className="text-xl" htmlFor="state">
              Estado:
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              disabled={!isEditable}
              className={`border p-2 rounded-lg w-full disabled:text-black disabled:opacity-100 ${
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
          <div className="flex flex-col gap-3 w-[200px]">
            <label className="text-xl" htmlFor="antiquity">
              Antiguedad:
            </label>
            <input
              type="date"
              name="antiquity"
              value={formData.antiquity}
              onChange={handleInputChange}
              disabled={!isEditable}
              className={`border p-2 rounded-lg w-full ${
                isEditable ? "  border-slate-400" : " "
              }`}
            />
          </div>
          <div className="flex flex-col gap-3 w-[400px]">
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
            <label className="text-xl" htmlFor="exactAddress">
              Dirección Exacta:
            </label>
            <textarea
              className={`border p-2 rounded-lg w-full disabled:text-black disabled:opacity-100 ${
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
            <div>
              <button
                onClick={()=> setcontratoViewActive(true)}
                className="bg-black  text-white px-5 py-2 border rounded-full mr-5"
              >
                { formData.state == "Ocupado"? "Ver Contrato" : "Crear Contrato"}
              </button>
              <button
                onClick={handleEdit}
                className="bg-main-blue text-white px-5 py-2 border rounded-full"
              >
                Editar
              </button>
            </div>
          ) : (
            <div className="">
              <button
                onClick={handleDelete}
                className="button-cancel"
              >
                Borrar
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-slate-400 mx-5 text-white px-5 py-2 border rounded-full"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="button-success"
              >
                Guardar
              </button>
            </div>
          )}
        </div>
      </div>
     
      { existContract && contratoViewActive &&  <ContractDetail propiedad={formData}/>}
      { !existContract && contratoViewActive &&  <ContractCreate propiedad={formData}/>}
    </div>
  );
};
