import { useEffect, useState } from "react";
import { TablaDinamica } from "../Table";
import Pagination from "../pagination/pagination";
import { PropertyService } from "../../services/propertyServices"; // Servicio de propiedades
import { selectUser } from "../../store/authSlice";
import { useSelector } from "react-redux";

const PropertySearch = ({ setPropertyData }) => {
  const { user, token } = useSelector(selectUser);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filaSeleccionada, setFilaSeleccionada] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;
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
      const data = await PropertyService.getPropertiesByCompanyId(token, user.company_id, currentPage, itemsPerPage);
      // Filtrar los resultados para incluir solo propiedades con estado "Ocupado"
      const filteredProperties = data.properties.filter(property => property.state === "Ocupado");
      setResults(filteredProperties);
    } catch (err) {
      setError("Error al buscar propiedades. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    handleSearch(term); // Carga inicial con el término de búsqueda actual
  }, [currentPage]); // Reaccionar al cambio de página
  
  useEffect(() => {
    if (filaSeleccionada >= 0 && results[filaSeleccionada]) {
      setPropertyData(results[filaSeleccionada]);
    }
  }, [filaSeleccionada, setPropertyData, results]);
  
  const handleChange = (e) => {
    setTerm(e.target.value);
    handleSearch(e.target.value);
  };
  
  // Crear un resumen de propiedades con solo los campos deseados
  const propertySummary = results.map(({ Id,name, customer_dni, province, canton }) => ({
    Id,
    name,
    cliente: customer_dni,
    province,
    canton
  }));
  
  const currentItems = propertySummary.slice(startIndex, endIndex);
  
  return (
    <div className="p-10 m-5 rounded-main bg-white border shadow min-h-[688px]">
      <h2>Buscar Propiedades</h2>
      <input
        type="text"
        value={term}
        onChange={handleChange}
        placeholder="Buscar propiedad..."
        className="input-text"
      />
      {loading && <p>Buscando...</p>}
      {error && <p className="error">{error}</p>}
      {results && results.length > 0 && (
        <>
          <TablaDinamica
            datos={currentItems}
            setFilaSeleccionada={setFilaSeleccionada}
            dataType="Properties"
          />
          <Pagination
            totalItems={results.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default PropertySearch;
