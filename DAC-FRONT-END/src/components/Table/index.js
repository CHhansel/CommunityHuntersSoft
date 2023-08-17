import { useState } from 'react';



// eslint-disable-next-line react/prop-types
export const TablaDinamica = ({ datos }) => {
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const columnas = Object.keys(datos[0]);
  const handleClick = (fila) => {
    setFilaSeleccionada(fila);
  };

  return (
    <div>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            {columnas.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
            <th>Ver</th>
          </tr>
        </thead>
        <tbody>
          {/* eslint-disable-next-line react/prop-types */}
          {datos.map((fila, index) => (
            <tr key={index}>
              {columnas.map((col, colIndex) => (
                <td key={colIndex}>{fila[col]}</td>
              ))}
              <td>
                <button onClick={() => handleClick(fila)}>👁️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filaSeleccionada && <ComponenteDetalle fila={filaSeleccionada} />}
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const ComponenteDetalle = ({ fila }) => {
  return (
    <div>
      <h3>Detalles:</h3>
      {/* Aquí puedes renderizar la información completa de la fila seleccionada */}
      {Object.entries(fila).map(([key, value], index) => (
        <p key={index}>
          {key}: {value}
        </p>
      ))}
    </div>
  );
};

