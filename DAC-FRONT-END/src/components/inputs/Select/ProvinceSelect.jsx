import { useEffect } from "react";

// ProvinceSelect.jsx
export const ProvinceSelect = ({ value, onChange, isEditable = true }) => {
    // Simulando una lista de provincias obtenida de una fuente de datos
    const provincias = [
        { idProvincia: 1, nombreProvincia: 'San Jose' },
        { idProvincia: 2, nombreProvincia: 'Alajuela' },
        { idProvincia: 3, nombreProvincia: 'Cartago' },
        { idProvincia: 4, nombreProvincia: 'Heredia' },
        { idProvincia: 5, nombreProvincia: 'Guanacaste' },
        { idProvincia: 6, nombreProvincia: 'Puntarenas' },
        { idProvincia: 7, nombreProvincia: 'Limon' },
        // ... otros datos de provincias
    ];
   useEffect(() => {
     
   }, [])
   
    return (
      <div className="flex flex-col gap-3">
        <label className="text-lg " htmlFor="province_code">
          Provincia
        </label>
        <select
          className="input-text"
          name="province_code"
          value={value}
          onChange={onChange}
          disabled={!isEditable}
        >
          {provincias.map((provincia) => (
            <option key={provincia.idProvincia} value={provincia.idProvincia}>
              {provincia.nombreProvincia}
            </option>
          ))}
        </select>
      </div>
    );
};
