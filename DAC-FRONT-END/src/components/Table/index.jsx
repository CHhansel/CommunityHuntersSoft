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
    <div className="w-100 flex flex-col justify-center items-center my-5 rounded-main shadow  p-5 bg-white">
      <table className="table-auto w-full radio rounded-main">
        <thead>
          <tr className="">
            {columnsParseadas.map((col, index) => (
              <th className="bg-[#dadae3] py-[16px] text-base first:rounded-tl-main first:rounded-bl-main last:rounded-br-main last:rounded-tr-main" key={index}>
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
              className={`hover:text-white hover:bg-main-blue cursor-pointer rounded-main hover:opacity-70  text-sm ${
                filaActiva === index
                  ? "bg-main-blue text-white"
                  : " odd:bg-[#F7F7F9] "
              }  `}
            >
              {columnas.map((col, colIndex) => (
                <td key={colIndex} className=" text-center pointer p-[8px] first:rounded-tl-main first:rounded-bl-main last:rounded-br-main last:rounded-tr-main">
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
