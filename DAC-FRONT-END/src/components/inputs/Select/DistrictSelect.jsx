import { useEffect, useState } from "react";
import { getDistritos } from "../../../utils/GeoService"; // Asegúrate de que la ruta sea correcta

export const DistrictSelect = ({ formData, onChange, isEditable = true }) => {
  const [distritos, setDistritos] = useState([]);

  useEffect(() => {
    if (formData.province_code && formData.canton_code) {
      // Llama a la función getDistritos con el idProvincia y idCanton para obtener los distritos
      let distritosDelCanton = getDistritos(formData.province_code, formData.canton_code);
      // Remueve el primer elemento si la lista tiene al menos un elemento
      if (distritosDelCanton.length > 0) {
        distritosDelCanton = distritosDelCanton.slice(1);
      }
      setDistritos(distritosDelCanton);
    }
  }, [formData.province_code, formData.canton_code]); // Este efecto se ejecuta cuando idProvincia o idCanton cambia

  return (
    <div className="flex flex-col gap-3">
      <label className="text-lg " htmlFor="district_code">
        Distrito
      </label>
      <select
        className="input-text"
        name="district_code"
        value={formData.district_code}
        onChange={onChange}
        disabled={!distritos.length || !isEditable}
      >
        <option value="">Seleccione un distrito</option>
        {distritos.map((distrito) => (
          <option key={distrito.idDistrito} value={distrito.idDistrito}>
            {distrito.nombreDistrito}
          </option>
        ))}
      </select>
    </div>
  );
};
