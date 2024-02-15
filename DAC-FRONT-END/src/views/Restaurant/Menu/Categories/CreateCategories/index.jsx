import { useEffect, useState } from "react";
import Button from "../../../../../components/buttons/Button";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../store/authSlice";
import { useDeleteProductCategory } from "../../../../../hooks/categories/useDeleteCategory";
import { useInsertProductCategory } from "../../../../../hooks/categories/useInsertProductCategory";
import { useUpdateProductCategory } from "../../../../../hooks/categories/useUpdateProductCategory";

const CategoryCreateForm = ({
  onClose,
  selectedCategory,
  setSelectedCategory,
  handleReloadCategories,
}) => {
  const { user } = useSelector(selectUser);
  const [categoryData, setCategory] = useState(selectedCategory);
  const [loading, setLoading] = useState(true);
  const { deleteProductCategoryById, isLoading, error } =
    useDeleteProductCategory(); // Aquí se utiliza el hook
  const {
    insertProductCategory,
    isLoading: isInserting,
    error: insertError,
  } = useInsertProductCategory(); // Hook para insertar categorías
  const {
    updateProductCategory,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateProductCategory(); // Hook para insertar categorías

  useEffect(() => {
    if (selectedCategory == null) {
      setCategory({
        name: "",
        description: "",
        image_url: "",
        active: 1,
        sort_order: null,
        company_id: user.company_id,
      });
    } else {
      setCategory(selectedCategory);
    }
    setLoading(false);
  }, [selectedCategory]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleDelete = async () => {
    try {
      await deleteProductCategoryById(selectedCategory.id); // Llama al método de eliminación del hook
      handleReloadCategories();
      onClose(); // Cierra el formulario después de la eliminación
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      // Maneja el error si es necesario
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory == null) {
        await insertProductCategory(categoryData);
      } else {
        console.log("update");
        await updateProductCategory(selectedCategory.id, categoryData);
        setSelectedCategory(categoryData)
      }
      handleReloadCategories();
      onClose();
    } catch (error) {
      console.error("Error al insertar la categoría:", error);
    }
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
      <form
        onSubmit={handleSubmit}
        className="flex justify-start flex-wrap items-start gap-5 w-full"
      >
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
          <Button type="CANCEL" onClick={onClose} />
          {selectedCategory == null ? (
            <Button type="ADD" onClick={handleSubmit} text={"CATEGORIA"} />
          ) : (
            <>
              <Button type="DELETE" onClick={handleDelete} text={"CATEGORIA"} />
              <Button type="UPDATE" onClick={handleSubmit} text={"CATEGORIA"} />
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryCreateForm;
