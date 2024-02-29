import { useEffect, useState } from "react";
import { useCreateProduct } from "../../../../../hooks/products/useCreateProduct";
import { useDeleteProduct } from "../../../../../hooks/products/useDeleteProduct"; // Importa el hook
import { useUpdateProduct } from "../../../../../hooks/products/useUpdateProduct";
import { useFileUpload } from "../../../../../hooks/files/useFileUpload"; // Asegúrate de proporcionar la ruta correcta
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../store/authSlice";
import Swal from "sweetalert2";
import Button from "../../../../../components/buttons/Button";
import { restaurantModuleCabys } from "../../../../../utils/cabysByModule";

import DropdownOptions from "../../../../../components/MultiSelectAlert";

const ProductCreate = ({
  onClose,
  selectedProduct,
  categories,
  relations,
  handleReloadCategories,
}) => {
  const { user } = useSelector(selectUser);
  const [productData, setProductData] = useState(selectedProduct);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(
    "http://localhost:3000/uploads/default-product-image.webp"
  );
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    if (selectedProduct == null) {
      setProductData({
        internal_code: "",
        name: "",
        description: "",
        price: "",
        quantity: "1",
        cabys_code: "",
        unit_of_measure: "Unid",
        tax_rate: "",
        company_id: user.company_id,
        tax_included: "1",
        image_url: "http://localhost:3000/uploads/default-product-image.webp",
      });
    } else {
      setProductData(selectedProduct);
      setPreviewUrl(selectedProduct.image_url);
    }
    setLoading(false);
  }, [selectedProduct]);

  const [selectedFile, setSelectedFile] = useState(null); // Nuevo estado para el archivo seleccionado

  const { imageUrl, uploadFile } = useFileUpload(); // Usa tu hook personalizado
  const { createProduct } = useCreateProduct();
  const { deleteProductById } = useDeleteProduct(); // Usa el hook
  const { updateProduct } = useUpdateProduct(); // Usa el hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const productRelations = (productId, data) => {
    console.log(productId, data);
    const relations = [];
    for (const item of data) {
      if (item.product_id === productId) {
        // Encuentra la categoría que coincide con el category_id del item
        const category = categories.find(
          (category) => category.id === item.category_id
        );
        // Agrega el nombre de la categoría al objeto si la categoría existe
        if (category) {
          relations.push({
            // ...item,
            id: category.id,
            name: category.name, // Agrega el nombre de la categoría
          });
        } else {
          // Si no encuentra la categoría, agrega el item sin modificar
          relations.push(item);
        }
      }
    }
    return relations;
  };

  useEffect(() => {
    if (productData && categories) {
      // Aquí asumo que productRelations es una función que determina las opciones seleccionadas
      // basado en el ID del producto actual y las categorías disponibles.
      const newSelectedOptions = productRelations(productData.id, relations);
      console.log("categorias son", newSelectedOptions);
      setSelectedOptions(newSelectedOptions);
    }
  }, [productData, relations, setSelectedOptions]); // Dependencias del efecto

  const handleUpdate = async () => {
    try {
      const result = await Swal.fire({
        title: "¿Desea actualizar este producto?",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
      });
      if (result.isConfirmed) {
        let productDataToUpdate = { ...productData };
        productDataToUpdate.category_ids = selectedOptions.map(
          (option) => option.id
        );

        if (selectedFile) {
          const formData = new FormData();
          formData.append("myFile", selectedFile);
          const { path } = await uploadFile(formData);

          productDataToUpdate.image_url = path;
        }
        const response = await updateProduct(
          productDataToUpdate.id,
          productDataToUpdate
        );
        handleReloadCategories();
        onClose();
        console.log("Product updated successfully:", response);
      } else if (result.isDenied) {
        Swal.fire("Los cambios no se guardaron", "", "info");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      // Handle error if needed
    }
    onClose(true);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Actualiza el estado con el archivo seleccionado
      const url = URL.createObjectURL(file); // Crea una URL para el archivo
      setPreviewUrl(url); // Actualiza el estado de la URL de vista previa
    }
  };
  const handleCabys = (e) => {
    const { value } = e.target;

    // Encuentra el elemento Cabys seleccionado
    const selectedCabys = restaurantModuleCabys.find(
      (item) => item.code === value
    );

    if (selectedCabys) {
      setProductData((prevState) => ({
        ...prevState,
        cabys_code: selectedCabys.code,
        tax_rate: selectedCabys.tax, // Establece el tax_rate basado en la selección
      }));
    } else {
      // En caso de que se seleccione la opción "Seleccione un Código Cabys"
      setProductData((prevState) => ({
        ...prevState,
        cabys_code: "",
        tax_rate: "",
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: "¿Desea crear este producto?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
    });
    if (result.isConfirmed) {
      try {
        let productDataToUpdate = { ...productData }; // Copia del estado actual
        productDataToUpdate.category_ids = selectedOptions.map(
          (option) => option.id
        );
        if (selectedFile) {
          // Crear un objeto FormData y añadir el archivo
          const formData = new FormData();
          formData.append("myFile", selectedFile);

          // Llamar a uploadFile con el objeto FormData
          const { path } = await uploadFile(formData);
          productDataToUpdate.image_url = path; // Actualizar la copia del estado con la nueva URL de imagen
          handleReloadCategories();
          onClose();
        }

        // Llama a createProduct con la data actualizada
        const response = await createProduct(productDataToUpdate);
        console.log("Product created successfully:", response);
      } catch (err) {
        console.error("Error creating product:", err);
      }
    } else if (result.isDenied) {
      Swal.fire("Los cambios no se guardaron", "", "info");
    }

    onClose(true);
  };
  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: "¿Desea eliminar este producto?",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
      });
      if (result.isConfirmed) {
        await deleteProductById(selectedProduct.id);
        handleReloadCategories();
        onClose();
      } else if (result.isDenied) {
        Swal.fire("Operación cancelada", "", "info");
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      // Manejar el error si es necesario
    }
    onClose(true);
  };
  const handleActiveChange = (e) => {
    setProductData((prevData) => ({
      ...prevData,
      active: e.target.checked ? 1 : 0, // Si el checkbox está marcado, active es 1, de lo contrario es 0
    }));
  };
  if (loading) {
    return <div>Cargando</div>;
  }
  return (
    <div className="p-10 rounded-main bg-white border shadow">
      <h2 className="text-2xl text-main-blue mb-8">Crear Producto</h2>
      <form onSubmit={handleSubmit} className="">
        <div className="flex mb-5">
          <div className="flex justify-start flex-wrap items-center gap-5 w-full">
            <div className="w-[300px]">
              {previewUrl && (
                <img
                  className="w-full border border-main-color"
                  src={previewUrl}
                  alt="Vista previa"
                />
              )}
              <div className="flex flex-col gap-3">
                <input
                  className="file:mr-4 file:py-2 file:px-4 mt-3
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-main-color
            hover:file:bg-violet-100 cursor-pointer"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label>Código interno:</label>
              <input
                className="input-text"
                type="text"
                name="internal_code"
                value={productData.internal_code}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <label>Nombre:</label>
              <input
                className="input-text"
                type="text"
                name="name"
                value={productData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <label>Descripción:</label>
              <textarea
                className="input-text"
                name="description"
                value={productData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-3">
                <label>Precio:</label>
                <input
                  className="input-text"
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <label>Precio De comparación:</label>
                <input
                  className="input-text"
                  type="number"
                  name="comparison_price"
                  value={productData.comparison_price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg " htmlFor="cabys_code">
                Código Cabys
              </label>
              <select
                className="input-text"
                name="cabys_code"
                value={productData.cabys_code}
                onChange={handleCabys}
                required
              >
                <option value="">Seleccione un Código Cabys</option>
                {restaurantModuleCabys.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code} {item.description} - {item.tax}%
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-3">
              <label>Impuesto %:</label>
              <input
                className="input-text"
                type="number"
                name="tax_rate"
                value={productData.tax_rate}
                onChange={handleChange}
                required
                disabled
              />
            </div>
            <div className="flex flex-col gap-3">
              <label>Impuesto Incluido:</label>
              <select
                className="input-text"
                name="tax_included"
                value={productData.tax_included}
                onChange={handleChange}
                required
              >
                <option value="1">Sí</option>
                <option value="0">No</option>
              </select>
            </div>
            <div className="flex flex-col items-center gap-3">
              <label>Producto Activo:</label>
              <label
                htmlFor="active"
                className="flex items-center cursor-pointer"
              >
                <div className="relative">
                  <input
                    id="active"
                    type="checkbox"
                    className="sr-only" // Mantiene el checkbox accesible pero no visible
                    checked={productData.active === 1}
                    onChange={handleActiveChange}
                  />
                  <div className="block border w-14 h-8 rounded-full"></div>

                  <div
                    className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                      productData.active === 1
                        ? "transform translate-x-full bg-blue-400"
                        : "bg-slate-500"
                    }`}
                  ></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">
                  {productData.active === 1 ? "Activo" : "Oculto"}
                </div>
              </label>
            </div>
          </div>
          <div>
            <div className="flex flex-col items-center ">
              <div className="w-52">
                <DropdownOptions
                  options={categories}
                  initialSelectedOptions={selectedOptions}
                  setSelectedOptions={setSelectedOptions} // Pasa la función para actualizar las opciones seleccionadas
                />
              </div>

              {/* Mostrar las opciones seleccionadas */}
              <div className="">
                <h2 className="text-lg font-semibold ">Categorias:</h2>
                <div className="w-[200px] flex flex-row flex-wrap">
                  {selectedOptions.map((option, index) => (
                    <p
                      key={index}
                      className="text-sm border px-3 py-1 mr-4 mb-2 rounded-main whitespace-nowrap"
                    >
                      {option.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
<div>
  <p>*<span className="line-through"> Precio de comparación </span>/ Precio</p>
  <p>Ejemplo:</p>
  <p><span className="line-through mx-3">₡ 20.500,00</span>₡ 12.000,00</p>
  <p>Sino desea agregar descuento, solo agregue el precio y deje en blanco el precio de comparación</p>
</div>
        <div className="w-full flex justify-end">
          <Button type="CANCEL" onClick={onClose} />
          {selectedProduct == null ? (
            <Button type="ADD" onClick={handleSubmit} />
          ) : (
            <>
              <Button type="DELETE" onClick={handleDelete} text={"PRODUCTO"} />
              <Button type="UPDATE" onClick={handleUpdate} text={"PRODUCTO"} />
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;
