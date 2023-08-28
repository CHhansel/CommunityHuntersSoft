import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../store/authSlice";
import { createPropertyAction } from "../../../actions/properties";



export const PropertyCreate = () => {
    const { user, token } = useSelector(selectUser);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        state: '',
        province: '',
        canton: '',
        district: '',
        exactAddress: '',
        user_id: user.id // Puedes establecer un valor predeterminado si es necesario
    });
    const dispatch = useDispatch();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(
                
                createPropertyAction({ data:formData,
                  token
                })
              );
            alert('Propiedad creada con éxito!');
        } catch (error) {
            console.error('Hubo un error al crear la propiedad:', error);
            alert('Error al crear propiedad. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="create-property-form">
            <h2>Crear Propiedad</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Nombre de la propiedad" value={formData.name} onChange={handleChange} required />
                <textarea name="description" placeholder="Descripción" value={formData.description} onChange={handleChange} required></textarea>
                <input type="text" name="state" placeholder="Estado" value={formData.state} onChange={handleChange} required />
                <input type="text" name="province" placeholder="Provincia" value={formData.province} onChange={handleChange} required />
                <input type="text" name="canton" placeholder="Cantón" value={formData.canton} onChange={handleChange} required />
                <input type="text" name="district" placeholder="Distrito" value={formData.district} onChange={handleChange} required />
                <input type="text" name="exactAddress" placeholder="Dirección exacta" value={formData.exactAddress} onChange={handleChange} required />
                <button type="submit">Crear Propiedad</button>
            </form>
        </div>
    );
};

