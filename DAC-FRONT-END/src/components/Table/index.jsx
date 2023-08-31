import "./TableStyles.css";
import { useState } from "react";
import { parseData } from "../../utils/dataTransformers";

// eslint-disable-next-line react/prop-types
export const TablaDinamica = ({ datos, setFilaSeleccionada, dataType }) => {
  const [filaActiva, setFilaActiva] = useState(null);
  const columnas = Object.keys(datos[0]);
  const columnsParseadas = parseData(columnas, dataType);

  const handleClick = (index) => {
    setFilaSeleccionada(index);
    setFilaActiva(index);
  };

  return (
    <div className="w-100 flex flex-col justify-center items-center my-5">
      <table className="table-auto w-full radio">
        <thead>
          <tr className="">
            {columnsParseadas.map((col, index) => (
              <th className="px-5 py-4" key={index}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* eslint-disable-next-line react/prop-types */}
          {datos.map((fila, index) => (
            <tr
              key={index}
              onClick={() => handleClick(index)}
              className={`hover:text-white hover:bg-main-blue cursor-pointer hover:opacity-70  ${
                filaActiva === index
                  ? "bg-main-blue text-white"
                  : "even:bg-even-row-table odd:bg-white "
              }`}
            >
              {columnas.map((col, colIndex) => (
                <td key={colIndex} className=" text-center pointer">
                  {fila[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
