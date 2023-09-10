import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";


import { selectUser } from "../../../../store/authSlice";
import { createPropertyAction } from "../../../../actions/properties";

export const RoleCreate = () => {
  const { user, token } = useSelector(selectUser);
  const [formData, setFormData] = useState({
    name: "",
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
            placeholder="Nombre de el rol"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

      </form>
    </div>
  );
};
