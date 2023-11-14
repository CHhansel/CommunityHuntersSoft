import { useEffect, useState } from "react";
import { TablaDinamica } from "../Table";
import Pagination from "../pagination/pagination";
import { CustomerService } from "../../services/CustomerService";
import { selectUser } from "../../store/authSlice";
import { useSelector } from "react-redux";

const CustomerSearch = ({ setCustomer }) => {
  const { user, token } = useSelector(selectUser);
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
      console.log(token);
      const { customers } = await CustomerService.getCustomers(token, user.company_id, currentPage, itemsPerPage);  // Asumiendo que la API sigue la misma estructura
      setResults(customers);
    } catch (err) {
      setError("Error al buscar clientes. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    handleSearch(" ");  // Este valor inicial podría necesitar ser actualizado
  }, []);
  
  useEffect(() => {
    if (filaSeleccionada >= 0) {
      setCustomer(results[filaSeleccionada]);
    }
  }, [filaSeleccionada, setCustomer, results]);
  
  const handleChange = (e) => {
    setTerm(e.target.value);
    handleSearch(e.target.value);
  };
  const customersResume = JSON.parse(JSON.stringify(results));
  customersResume.forEach((customer) => {
    delete customer.Id;
    delete customer.province;
    delete customer.canton;
    delete customer.district;
    delete customer.exact_address;
    delete customer.company_id;
    delete customer.note;
    delete customer.creation_date;
    delete customer.total_amount;
    delete customer.payment_method;
    delete customer.dni_type_id;
  });
  const currentItems = customersResume.slice(startIndex, endIndex);

  return (
    <div className="p-10 m-5 rounded-main bg-white border shadow min-h-[688px]">
      <h2>Buscar Clientes</h2>
      <input
        type="text"
        value={term}
        onChange={handleChange}
        placeholder="Buscar cliente..."
        className="input-text"
      />
      {loading && <p>Buscando...</p>}
      {error && <p className="error">{error}</p>}
      {results && results.length > 0 && (
        <>
          <TablaDinamica
            datos={currentItems}
            setFilaSeleccionada={setFilaSeleccionada}
            dataType="Customers"
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

export default CustomerSearch;
