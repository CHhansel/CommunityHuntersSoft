import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../store/authSlice";
import { createPropertyAction } from "../../../actions/properties";
import { getProvincias, getCantones, getDistritos } from '../../../utils/GeoService';

export const PropertyCreate = () => {
  const { user, token } = useSelector(selectUser);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    state: "Disponible",
    province: "San José",
    canton: "",
    district: "",
    exact_address: "",
    antiquity: "",
    company_id: user.company_id,
    user_id: user.id
  });
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  formData.province;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(createPropertyAction({ data: formData, token }));
      alert("Propiedad creada con éxito!");
    } catch (error) {
      console.error("Hubo un error al crear la propiedad:", error);
      alert("Error al crear propiedad. Por favor, inténtalo de nuevo.");
    }
  };
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
  return (
    <div className="p-10 my-5 rounded-main bg-white border shadow">
      <h2 className="text-2xl text-main-blue mb-8">Crear Propiedad</h2>

      <form
        onSubmit={handleSubmit}
        className=" flex justify-between flex-wrap items-start gap-5 w-full"
      >
        <div className="flex flex-col gap-3">
          <label className="text-lg " htmlFor="name">
            Nombre
          </label>
          <input
            className="input-text"
            type="text"
            name="name"
            placeholder="Nombre de la propiedad"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col  gap-3 ">
          <label className="text-lg" htmlFor="description">
            Descripción
          </label>
          <textarea
            className="input-text"
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-lg" htmlFor="state">
            Estado
          </label>
          <select
            className="input-text"
            name="state"
            value={formData.state}
            onChange={handleChange}
          >
            <option value="Disponible">Disponible</option>
            <option value="Ocupado">Ocupado</option>
            <option value="Mantenimiento">Mantenimiento</option>
          </select>
        </div>
        <div className="flex flex-col gap-3">
            <label className="text-lg" htmlFor="antiquity">
              Antiguedad:
            </label>
            <input
              type="date"
              name="antiquity"
              value={formData.antiquity}
              className="input-text"
              onChange={handleChange}
              required
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
          onChange={handleChange}
        >
          {getProvincias().map(provincia => (
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
          className="input-text"
          name="canton"
          value={formData.canton}
          onChange={handleChange}
          disabled={!cantones.length}
        >
          <option value="">Seleccione un cantón</option>
          {cantones.map(canton => (
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
          className="input-text"
          name="district"
          value={formData.district}
          onChange={handleChange}
          disabled={!distritos.length}
        >
          <option value="">Seleccione un distrito</option>
          {distritos.map(distrito => (
            <option key={distrito} value={distrito}>
              {distrito}
            </option>
          ))}
        </select>
      </div>

        <div className="flex flex-col gap-3">
          <label className="text-lg " htmlFor="exact_address">
            Dirección exacta
          </label>
          <textarea
            className="input-text"
            name="exact_address"
            placeholder="Dirección exacta"
            value={formData.exact_address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full flex justify-end">
          <button
            className="mt-12 button-success"
            type="submit"
          >
            Crear Propiedad
          </button>
        </div>
      </form>
    </div>
  );
};
