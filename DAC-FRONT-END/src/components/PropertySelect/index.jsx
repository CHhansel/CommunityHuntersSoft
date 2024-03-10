import { useEffect, useState } from "react";
import { TablaDinamica } from "../Table";
import Pagination from "../pagination/pagination";
import { selectUser } from "../../store/authSlice";
import { useSelector } from "react-redux";
import { useFetchProperties } from "../../hooks/properties/useFetchProperties";

const PropertySearch = ({ setProperty }) => {
  const { user } = useSelector(selectUser);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filaSeleccionada, setFilaSeleccionada] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;
  const [filteredProperties, setFilteredProperties] = useState([]);

  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const {
    propertyData: { properties, totalProperties }
  } = useFetchProperties(user.company_id, 1, itemsPerPage, reloadTrigger);
  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
  
    setLoading(true);
    setError(null);
  };
  
  useEffect(() => {
    handleSearch(term); // Carga inicial con el término de búsqueda actual
  }, [currentPage]); // Reaccionar al cambio de página
  
  useEffect(() => {
    if (filaSeleccionada >= 0) {
      setProperty(properties[filaSeleccionada]);
    }
  }, [filaSeleccionada, results]);
  
  const handleChange = (e) => {
    setTerm(e.target.value);
    handleSearch(e.target.value);
  };

  useEffect(() => {
    // Si hay un término de búsqueda, filtre las propiedades. De lo contrario, muestre todas.
    const filteredResults = term
      ? properties.filter((property) =>
          property.internal_code.toLowerCase().includes(term.toLowerCase()) ||
          property.name.toLowerCase().includes(term.toLowerCase())
        )
      : properties;
  // Crear un resumen de propiedades con solo los campos deseados
  const propertySummary = filteredResults.map(({ internal_code,name }) => ({
    "Código interno":internal_code,
     name
  }));
    setFilteredProperties(propertySummary);
  }, [term, properties, currentPage]);

  
  
  return (
    <div className="p-10">
      <h2>Buscar Propiedades</h2>
      <input
        type="text"
        value={term}
        onChange={handleChange}
        placeholder="Buscar propiedad..."
        className="input-text"
      />
      {error && <p className="error">{error}</p>}
      {properties && properties.length > 0 && (
        <>
          <TablaDinamica
            datos={filteredProperties}
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
