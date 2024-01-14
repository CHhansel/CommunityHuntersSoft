import { useEffect, useState } from "react";
import { getCantones } from "../../../utils/GeoService"; // Asegúrate de que la ruta sea correcta

export const CantonSelect = ({ formData, onChange, isEditable = true }) => {
  const [cantones, setCantones] = useState([]);

  useEffect(() => {
    
    if (formData.province_code) {
      // Llama a la función getCantones con el idProvincia para obtener los cantones
      let cantonesDeLaProvincia = getCantones(formData.province_code);
      // Remueve el primer elemento si la lista tiene al menos un elemento
      if (cantonesDeLaProvincia.length > 0) {
        cantonesDeLaProvincia = cantonesDeLaProvincia.slice(1);
      }
      setCantones(cantonesDeLaProvincia);
      console.log("son   ", cantonesDeLaProvincia);
    }
  }, [formData.province_code]); // Este efecto se ejecuta cuando idProvincia cambia

  return (
    <div className="flex flex-col gap-3">
      <label className="text-lg " htmlFor="canton_code">
        Cantón
      </label>
      <select
        className="input-text"
        name="canton_code"
        value={formData.canton_code}
        onChange={onChange}
        disabled={!cantones.length || !isEditable}
      >
        <option value="">Seleccione un cantón</option>
        {cantones.map((canton) => (
          <option key={canton.idCanton} value={canton.idCanton}>
            {canton.nombreCanton}
          </option>
        ))}
      </select>
    </div>
  );
};
