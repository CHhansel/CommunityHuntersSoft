import { useEffect, useState } from "react";
import { updatePropertyAction } from "../../../actions/properties";
import { selectUser } from "../../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { ContractDetail } from "../ContractDetails";
import { ContractCreate } from "../ContractCreate";
import {
  getProvincias,
  getCantones,
  getDistritos,
} from "../../../utils/GeoService";

// eslint-disable-next-line react/prop-types
export const PropertyDetail = ({ fila, updateTable }) => {
  const { user, token } = useSelector(selectUser);
  const [isEditable, setIsEditable] = useState(false);
  // eslint-disable-next-line react/prop-types
  const existContract = fila.state == "Ocupado" ? true : false;

  const [formData, setFormData] = useState({ ...fila, user_id: user.id });
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);

  useEffect(() => {
    if (formData.province) {
      setCantones(getCantones(formData.province));
    }
  }, [formData.province]);

  useEffect(() => {
    if (formData.canton) {
      setDistritos(getDistritos(formData.province, formData.canton));
    }
  }, [formData.canton]);
  const dispatch = useDispatch();
  const [contratoViewActive, setcontratoViewActive] = useState(false);
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
      updateTable();
    } catch (error) {
      console.error("Hubo un error al crear la propiedad:", error);
      alert("Error al crear propiedad. Por favor, inténtalo de nuevo.");
    }

    setIsEditable(false);
  };

  return (
    <div>
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
              className={`input-text`}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xl" htmlFor="description">
              Descripción:
            </label>
            <textarea
              className={`input-text`}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xl" htmlFor="state">
              Estado:
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              disabled={!isEditable}
              className={`input-text`}
            >
              <option value="Disponible">Disponible</option>
              <option value="Ocupado">Ocupado</option>
              <option value="Mantenimiento">Mantenimiento</option>
            </select>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xl" htmlFor="antiquity">
              Antigüedad:
            </label>
            <input
              type="date"
              name="antiquity"
              value={formData.antiquity}
              onChange={handleInputChange}
              disabled={!isEditable}
              className={`input-text`}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-lg " htmlFor="province">
              Provincia
            </label>
            <select
              className="input-text"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              disabled={!isEditable}
            >
              {getProvincias().map((provincia) => (
                <option key={provincia} value={provincia}>
                  {provincia}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-lg " htmlFor="canton">
              Cantón
            </label>
            <select
              className={`input-text  ${
                isEditable ? " " : ""
              }`}
              name="canton"
              value={formData.canton}
              onChange={handleInputChange}
              disabled={!isEditable || !cantones.length}
            >
              <option value="">Seleccione un cantón</option>
              {cantones.map((canton) => (
                <option key={canton} value={canton}>
                  {canton}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-lg " htmlFor="district">
              Distrito
            </label>
            <select
              className={`input-text bg-white ${
                isEditable ? " " : " bg-color-disabled"
              }bg-white`}
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              disabled={!isEditable || !distritos.length}
            >
              <option value="">Seleccione un distrito</option>
              {distritos.map((distrito) => (
                <option key={distrito} value={distrito}>
                  {distrito}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xl" htmlFor="exactAddress">
              Dirección Exacta:
            </label>
            <textarea
              className={`input-text  ${
                isEditable ? "  border-slate-400" : " bg-color-disabled "
              }`}
              name="exactAddress"
              value={formData.exact_address}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>
        </form>
        <div className="flex justify-end gap-8 mt-5">
          {!isEditable ? (
            <div>
              <button
                onClick={() => setcontratoViewActive(true)}
                className="bg-black  text-white px-5 py-2 border rounded-full mr-5"
              >
                {formData.state == "Ocupado"
                  ? "Ver Contrato"
                  : "Crear Contrato"}
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
              <button onClick={handleDelete} className="button-cancel">
                Borrar
              </button>
              <button
                onClick={handleCancelEdit}
                className="button-delete"
              >
                Cancelar
              </button>
              <button onClick={handleSave} className="button-success">
                Guardar
              </button>
            </div>
          )}
        </div>
      </div>

      {existContract && contratoViewActive && (
        <ContractDetail propiedad={formData} updateTable={updateTable} />
      )}
      {!existContract && contratoViewActive && (
        <ContractCreate propiedad={formData} updateTable={updateTable} />
      )}
    </div>
  );
};
