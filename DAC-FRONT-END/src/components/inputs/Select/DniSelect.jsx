import  { useEffect, useState } from 'react';
import { DniTypeService } from '../../../services/customerServices'; // Asegúrate de reemplazar con la ruta correcta

export const DniTypeSelect = ({ value, onChange, isEditable = true }) => {
    const [dniTypes, setDniTypes] = useState([]);

    useEffect(() => {
        const fetchDniTypes = async () => {
            try {
                const types = await DniTypeService.getDniTypes();
                setDniTypes(types);
            } catch (error) {
                console.error('Error al cargar los tipos de DNI:', error);
            }
        };

        fetchDniTypes();
    }, []);

    return (
        <div className="flex flex-col gap-3">
            <label className="text-lg " htmlFor="dni_type">
                Tipo de Identificación
            </label>
            <select
                className="input-text"
                name="dni_type"
                value={""+value} // Convertir a string para comparaciones
                onChange={onChange}
                disabled={!isEditable}
            >
                {dniTypes.map((type) => (
                    <option key={type.id} value={type.codigo}>
                        {type.tipoIdentificacion}
                    </option>
                ))}
            </select>
        </div>
    );
};
