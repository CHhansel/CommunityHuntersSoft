import { useState } from "react";
import Button from "../../../../../components/buttons/Button";

const CategoryCreateForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    active: 1, // Valor predeterminado '1'
    sort_order: null, // Valor predeterminado 'null'
  });
  const [selectedFile, setSelectedFile] = useState(null); // Nuevo estado para el archivo seleccionado

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file); // Actualiza el estado con el archivo seleccionado
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes realizar la lógica para enviar los datos del formulario al servidor
    console.log("Form data:", formData);
  };

  return (
    <div className="p-10 rounded-main bg-white border shadow">
      <h2 className="text-2xl text-main-blue mb-8">Crear Categoría</h2>
      <form onSubmit={handleSubmit} className=" flex justify-between flex-wrap items-start gap-5 w-full">
      <div className="flex flex-col gap-3">

          <label>Nombre:</label>
          <input
          className="input-text"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3">

          <label>Descripción:</label>
          <textarea
          className="input-text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="flex flex-col gap-3">
          <label>Image:</label>
          <input
            className="input-text"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        <div className="w-full flex justify-end">

          <Button type="CANCEL" onClick={onClose} />
          <Button type="ADD" onClick={handleSubmit} />
        </div>
      </form>
    </div>
  );
};

export default CategoryCreateForm;
