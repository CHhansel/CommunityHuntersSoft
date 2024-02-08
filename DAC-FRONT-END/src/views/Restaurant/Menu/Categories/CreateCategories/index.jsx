import { useEffect, useState } from "react";
import Button from "../../../../../components/buttons/Button";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../store/authSlice";

const CategoryCreateForm = ({ onClose, selectedCategory }) => {
  const { user } = useSelector(selectUser);
  const [categoryData, setCategory] = useState(selectedCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedCategory == null) {
      setCategory({
        name: "",
        description: "",
        image_url: "",
        active: 1, // Valor predeterminado '1'
        sort_order: null, // Valor predeterminado 'null'
        company_id: user.company_id,
      });
    } else {
      setCategory(selectedCategory);
    }
    setLoading(false);
  }, [selectedCategory]);
  const [selectedFile, setSelectedFile] = useState(null); // Nuevo estado para el archivo seleccionado

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevData) => ({
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
    
  };
  if (loading) {
    return <div>Cargando</div>;
  }
  return (
    <div className="p-10 rounded-main bg-white border shadow">
            <h2 className="text-2xl text-main-blue mb-8">
        {selectedCategory == null
          ? " Crear Categoria"
          : " Ver/Modificar Categoria"}
      </h2>
      <form onSubmit={handleSubmit} className=" flex justify-start flex-wrap items-start gap-5 w-full">
      <div className="flex flex-col gap-3">

          <label>Nombre:</label>
          <input
          className="input-text"
            type="text"
            name="name"
            value={categoryData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3">

          <label>Descripción:</label>
          <textarea
          className="input-text"
            name="description"
            value={categoryData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>


        <div className="w-full flex justify-end">

        <div className="w-full flex justify-end">
          <Button type="CANCEL" onClick={onClose} />
          {selectedCategory == null ? (
            <Button type="ADD" onClick={handleSubmit} text={"MESA"} />
          ) : (
            <>
              <Button type="DELETE" onClick={handleSubmit} text={"MESA"} />
              <Button type="UPDATE" onClick={handleSubmit} text={"MESA"} />
            </>
          )}
        </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryCreateForm;
