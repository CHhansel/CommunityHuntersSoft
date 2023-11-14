import { useEffect, useState } from "react";
import { CabysService } from "../../services/cabysServices"; // Asegúrate de usar la ruta correcta
import { TablaDinamica } from "../Table";
import Pagination from "../pagination/pagination";

const CabysSearch = ({ setCabys }) => {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filaSeleccionada, setFilaSeleccionada] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cabysResults = await CabysService.searchCabys(searchTerm);
      setResults(cabysResults);
    } catch (err) {
      setError("Error al buscar en CABYS. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleSearch("a");
  }, []);
  // Opción usando useEffect
  useEffect(() => {
    if (filaSeleccionada >= 0) {
      setCabys(results[filaSeleccionada].code);
    }
  }, [filaSeleccionada, setCabys, results]);
  const handleChange = (e) => {
    setTerm(e.target.value);
    handleSearch(e.target.value);
  };

  const currentItems = results.slice(startIndex, endIndex);

  return (
    <div className="p-10 m-5 rounded-main bg-white border shadow min-h-[688px]">
      <h2>Buscar en CABYS</h2>
      <input
        type="text"
        value={term}
        onChange={handleChange}
        placeholder="Buscar producto..."
        className="input-text"
      />
      {loading && <p>Buscando...</p>}
      {error && <p className="error">{error}</p>}
      {results && results.length > 0 && (
        <>
          <TablaDinamica
            datos={currentItems}
            setFilaSeleccionada={setFilaSeleccionada}
            dataType="Cabys"
          />
          <Pagination
            totalItems={results.length}
            itemsPerPage={10}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default CabysSearch;
