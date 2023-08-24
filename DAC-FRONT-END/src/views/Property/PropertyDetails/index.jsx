import { useState } from "react";


// eslint-disable-next-line react/prop-types
export const PropiedadDetalle = ({ fila }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState(fila);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleSave = () => {
    // Aquí puedes hacer la llamada a la API para actualizar los datos
    // Por ejemplo: updateDataInDatabase(formData);

    setIsEditable(false);
  };

  return (
    <div>
      <form>
        <div>
          <label>Nombre:</label>
          <input 
            type="text" 
            name="Nombre" 
            value={formData.Nombre} 
            onChange={handleInputChange} 
            disabled={!isEditable}
          />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleInputChange} 
            disabled={!isEditable}
          />
        </div>
        <div>
          <label>Estado:</label>
          <input 
            type="text" 
            name="Estado" 
            value={formData.Estado} 
            onChange={handleInputChange} 
            disabled={!isEditable}
          />
        </div>
        <div>
          <label>Provincia:</label>
          <input 
            type="text" 
            name="province" 
            value={formData.province} 
            onChange={handleInputChange} 
            disabled={!isEditable}
          />
        </div>
        <div>
          <label>Cantón:</label>
          <input 
            type="text" 
            name="canton" 
            value={formData.canton} 
            onChange={handleInputChange} 
            disabled={!isEditable}
          />
        </div>
        <div>
          <label>Distrito:</label>
          <input 
            type="text" 
            name="district" 
            value={formData.district} 
            onChange={handleInputChange} 
            disabled={!isEditable}
          />
        </div>
        <div>
          <label>Dirección Exacta:</label>
          <textarea 
            name="exactAddress" 
            value={formData.exactAddress} 
            onChange={handleInputChange} 
            disabled={!isEditable}
          />
        </div>
      </form>
      {!isEditable ? (
        <button onClick={handleEdit}>Editar</button>
      ) : (
        <button onClick={handleSave}>Guardar</button>
      )}
    </div>
  );
};
