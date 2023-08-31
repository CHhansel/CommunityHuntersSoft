import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../store/authSlice";
import { createCustomerAction } from "../../../actions/customer"; // Asegúrate de importar la acción correcta

export const CustomerCreate = () => {
  const { user, token } = useSelector(selectUser);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    dni: "",
    email: "",
    company_name: "",
    note: "",
    province: "",
    canton: "",
    district: "",
    exactAddress: "",
    user_id: user.id,
  });
  const dispatch = useDispatch();

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
      dispatch(createCustomerAction({ data: formData, token }));
      alert("Cliente creado con éxito!");
    } catch (error) {
      console.error("Hubo un error al crear el cliente:", error);
      alert("Error al crear cliente. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="create-customer-form">
      <form
        onSubmit={handleSubmit}
        className="m-5 flex justify-evenly flex-wrap items-start gap-y-5"
      >
        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="name">
            Nombre
          </label>
          <input
            className="border p-2 rounded-lg w-full"
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="lastname">
            Apellido
          </label>
          <input
            className="border p-2 rounded-lg w-full"
            type="text"
            name="lastname"
            placeholder="Apellido"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="dni">
            DNI
          </label>
          <input
            className="border p-2 rounded-lg w-full"
            type="text"
            name="dni"
            placeholder="DNI"
            value={formData.dni}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="email">
            Correo
          </label>
          <input
            className="border p-2 rounded-lg w-full"
            type="email"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="company_name">
            Nombre de la Empresa
          </label>
          <input
            className="border p-2 rounded-lg w-full"
            type="text"
            name="company_name"
            placeholder="Nombre de la Empresa"
            value={formData.company_name}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="note">
            Nota
          </label>
          <textarea
            className="border p-2 rounded-lg w-full"
            name="note"
            placeholder="Nota"
            value={formData.note}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="province">
            Provincia
          </label>
          <select
            className="border p-2 rounded-lg w-full"
            name="province"
            value={formData.province}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una provincia</option>
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

        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="district">
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
          <label className="text-xl" htmlFor="exactAddress">
            Dirección exacta
          </label>
          <input
            className="border p-2 rounded-lg w-full"
            type="text"
            name="exactAddress"
            placeholder="Dirección exacta"
            value={formData.exactAddress}
            onChange={handleChange}
            required
          />
        </div>

        <button className="mt-12 w-full" type="submit">
          Crear Cliente
        </button>
      </form>
    </div>
  );
};
