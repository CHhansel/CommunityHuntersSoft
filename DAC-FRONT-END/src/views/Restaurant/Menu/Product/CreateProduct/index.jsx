import { useState } from "react";
import { useCreateProduct } from "../../../../../hooks/products/useCreateProduct";
import { useFileUpload } from "../../../../../hooks/files/useFileUpload"; // Asegúrate de proporcionar la ruta correcta
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../store/authSlice";
import Swal from "sweetalert2";
import Button from "../../../../../components/buttons/Button";

const ProductCreate = ({ onClose }) => {
  const { user } = useSelector(selectUser);
  const [formData, setFormData] = useState({
    internal_code: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
    cabys_code: "",
    unit_of_measure: "",
    tax_rate: "",
    company_id: user.company_id,
    tax_included: "",
    img_url: "",
  });
  const [selectedFile, setSelectedFile] = useState(null); // Nuevo estado para el archivo seleccionado

  const { imageUrl, uploadFile } = useFileUpload(); // Usa tu hook personalizado
  const { createProduct, isLoading, error } = useCreateProduct();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: "Desea crear esta propiedad?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
    });
    if (result.isConfirmed) {
      // El usuario confirmó, procede a guardar
      try {
      } catch (err) {}
    } else if (result.isDenied) {
      // El usuario no confirmó, muestra un mensaje
      Swal.fire("Changes are not saved", "", "info");
    }
    // if (selectedFile) {
    //   // Crear un objeto FormData y añadir el archivo
    //   const formData = new FormData();
    //   formData.append('myFile', selectedFile);

    //   // Llamar a uploadFile con el objeto FormData
    //   const imageUrl = await uploadFile(formData);
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     img_url: imageUrl.path,
    //   }));
    // }

    // try {
    //   const response = await createProduct(formData);
    //   // Handle success and show a success message
    //   console.log("Product created successfully:", response);
    // } catch (err) {
    //   // Handle error and show an error message
    //   console.error("Error creating product:", err);
    // }
    onClose(true);
  };

  return (
    <div className="p-10 rounded-main bg-white border shadow">
      <h2 className="text-2xl text-main-blue mb-8">Crear Producto</h2>
      <form
        onSubmit={handleSubmit}
        className=" flex justify-between flex-wrap items-start gap-5 w-full"
      >
        <div className="flex flex-col gap-3">
          <label>Internal Code:</label>
          <input
            className="input-text"
            type="text"
            name="internal_code"
            value={formData.internal_code}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Name:</label>
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
          <label>Description:</label>
          <textarea
            className="input-text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="flex flex-col gap-3">
          <label>Price:</label>
          <input
            className="input-text"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Quantity:</label>
          <input
            className="input-text"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Cabys Code:</label>
          <input
            className="input-text"
            type="text"
            name="cabys_code"
            value={formData.cabys_code}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Unit of Measure:</label>
          <input
            className="input-text"
            type="text"
            name="unit_of_measure"
            value={formData.unit_of_measure}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Tax Rate:</label>
          <input
            className="input-text"
            type="number"
            name="tax_rate"
            value={formData.tax_rate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Company ID:</label>
          <input
            className="input-text"
            type="number"
            name="company_id"
            value={formData.company_id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Tax Included:</label>
          <input
            className="input-text"
            type="number"
            name="tax_included"
            value={formData.tax_included}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Image URL:</label>
          <input
            className="input-text"
            type="text"
            name="img_url"
            value={formData.img_url}
            onChange={handleChange}
            required
          />
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

export default ProductCreate;
