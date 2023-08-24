// eslint-disable-next-line react/prop-types
export const TablaDinamica = ({ datos, setFilaSeleccionada }) => {
  const columnas = Object.keys(datos[0]);
  const handleClick = (fila) => {
    setFilaSeleccionada(fila);
  };

  return (
    <div className='w-100 flex flex-col justify-center items-center'>
      <table className='table-auto w-full border-collapse border border-slate-500'>
        <thead>
          <tr>
            {columnas.map((col, index) => (
              <th className='px-5 border border-slate-600' key={index}>{col}</th>
            ))}
            <th>Ver</th>
          </tr>
        </thead>
        <tbody>
          {/* eslint-disable-next-line react/prop-types */}
          {datos.map((fila, index) => (
            <tr key={index}>
              {columnas.map((col, colIndex) => (
                <td key={colIndex} className='p-2 border border-slate-600'>{fila[col]}</td>
              ))}
              <td className='border border-slate-600'>
                <button onClick={() => handleClick(fila)}>👁️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
