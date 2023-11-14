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
    dni_type_id: 2,
    note: "",
    province: "",
    canton: "",
    district: "",
    exact_address: "",
    company_id: user.company_id,
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
    <div className="p-10 my-5 rounded-main bg-white border shadow">
      <form
        onSubmit={handleSubmit}
        className="flex justify-between flex-wrap items-start gap-5 w-full"
      >
        <div className="flex flex-col gap-3 ">
          <label className="text-xl" htmlFor="name">
            Nombre
          </label>
          <input
            className="input-text"
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-3 ">
          <label className="text-xl" htmlFor="lastname">
            Apellido
          </label>
          <input
            className="input-text"
            type="text"
            name="lastname"
            placeholder="Apellido"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3 ">
          <label className="text-xl" htmlFor="dni_type_id">
            Tipo de Identificación
          </label>
          <input
            className="input-text"
            type="text"
            name="dni_type_id"
            placeholder="Tipo de indentificación"
            value={formData.dni_type_id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3 ">
          <label className="text-xl" htmlFor="dni">
            Identificación
          </label>
          <input
            className="input-text"
            type="text"
            name="dni"
            placeholder="Identificación"
            value={formData.dni}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-3 ">
          <label className="text-xl" htmlFor="email">
            Correo
          </label>
          <input
            className="input-text"
            type="email"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-3 ">
          <label className="text-xl" htmlFor="company_name">
            Nombre de la Empresa
          </label>
          <input
            className="input-text"
            type="text"
            name="company_name"
            placeholder="Nombre de la Empresa"
            value={formData.company_name}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-wrap gap-5">
          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="province">
              Provincia
            </label>
            <select
              className="input-text"
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

          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="canton">
              Cantón
            </label>
            <input
              className="input-text"
              type="text"
              name="canton"
              placeholder="Cantón"
              value={formData.canton}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="district">
              Distrito
            </label>
            <input
              className="input-text"
              type="text"
              name="district"
              placeholder="Distrito"
              value={formData.district}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="exact_address">
              Dirección exacta
            </label>
            <input
              className="input-text"
              type="text"
              name="exact_address"
              placeholder="Dirección exacta"
              value={formData.exact_address}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 ">
          <label className="text-xl" htmlFor="note">
            Nota
          </label>
          <textarea
            className="input-text"
            name="note"
            placeholder="Nota"
            value={formData.note}
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
      <div className="flex justify-end gap-8 mt-5">
        <button className="button-success" type="submit">
          Crear Cliente
        </button>
      </div>
    </div>
  );
};
