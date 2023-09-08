import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../store/authSlice";
import { createPropertyAction } from "../../../actions/properties";

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

  return (
    <div className="border border-black p-5 my-5">
      <h2 className="text-2xl text-main-blue mb-8">Crear Propiedad</h2>

      <form
        onSubmit={handleSubmit}
        className="m-5 flex justify-evenly flex-wrap items-start gap-y-5"
      >
        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl " htmlFor="name">
            Nombre
          </label>
          <input
            className="border p-2 rounded-lg w-full"
            type="text"
            name="name"
            placeholder="Nombre de la propiedad"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl " htmlFor="description">
            Descripción
          </label>
          <textarea
            className="border p-2 rounded-lg w-full"
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="flex flex-col gap-3 w-[200px]">
          <label className="text-xl " htmlFor="state">
            Estado
          </label>
          <select
            className="border p-2 rounded-lg w-full"
            name="state"
            value={formData.state}
            onChange={handleChange}
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
              className="border p-2 rounded-lg w-full"
              onChange={handleChange}
              required
            />
          </div>
        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl " htmlFor="province">
            Provincia
          </label>
          <select
            className="border p-2 rounded-lg w-full"
            name="province"
            value={formData.province}
            onChange={handleChange}
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
          <label className="text-xl " htmlFor="canton">
            Cantón
          </label>
          <input
            className="border p-2 rounded-lg w-full"
            type="text"
            name="canton"
            placeholder="Cantón"
            value={formData.canton}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl " htmlFor="district">
            Distrito
          </label>
          <input
            className="border p-2 rounded-lg w-full"
            type="text"
            name="district"
            placeholder="Distrito"
            value={formData.district}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl " htmlFor="exact_address">
            Dirección exacta
          </label>
          <input
            className="border p-2 rounded-lg w-full"
            type="text-area"
            name="exact_address"
            placeholder="Dirección exacta"
            value={formData.exact_address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full flex justify-end">
          <button
            className="mt-12 bg-main-blue text-white px-5 py-2 border rounded-full"
            type="submit"
          >
            Crear Propiedad
          </button>
        </div>
      </form>
    </div>
  );
};
