import { useState } from "react";
import { useFetchCustomers } from "../../hooks/customers/useFetchCustomers";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/authSlice";

const BuscarCliente = ({ setCliente }) => {
  const { user } = useSelector(selectUser);
  const [reloadTrigger] = useState(0);
  const [searchCedula, setSearchCedula] = useState("");
  const [searchTelefono, setSearchTelefono] = useState("");

  const {
    customersData: { customers },
  } = useFetchCustomers(user.company_id, 1, 1000, reloadTrigger);

  // Filtrar clientes solo si hay algún valor en los inputs de búsqueda
  const filteredCustomers =
    searchCedula || searchTelefono
      ? customers.filter((customer) => {
          const matchCedula = searchCedula
            ? customer.dni && customer.dni.includes(searchCedula)
            : true;
          const matchTelefono = searchTelefono
            ? customer.phone_number &&
              customer.phone_number.includes(searchTelefono)
            : true;
          return matchCedula && matchTelefono;
        })
      : [];

  // Función para manejar el clic en un cliente
  const handleSelectCustomer = (customer) => {
    setCliente(customer); // Llamar al setState del componente padre
    setSearchCedula(""); // Resetear la búsqueda para limpiar los resultados
    setSearchTelefono(""); // Resetear la búsqueda para limpiar los resultados
  };

  // Determinar qué se debe mostrar
  let content;
  if (searchCedula || searchTelefono) {
    if (filteredCustomers.length > 0) {
      content = filteredCustomers.map((customer) => (
        <li
          className="cursor-pointer border p-1"
          key={customer.id}
          onClick={() => handleSelectCustomer(customer)}
        >
          {customer.name} - Cédula: {customer.dni} - Teléfono:{" "}
          {customer.phone_number}
        </li>
      ));
    } else {
      content = (
        <li className=" bg-slate-100 text-center">
          No se encontraron clientes.
        </li>
      );
    }
  } else {
    content = null; // No mostrar nada si no se ha buscado aún
  }

  return (
    <div className="">
      <h1 className="mt-5 mb-3 font-bold">Buscar Cliente</h1>
      <div className="flex justify-center gap-5">
        <input
          type="text"
          className="input-text"
          placeholder="Buscar por cédula"
          value={searchCedula}
          onChange={(e) => setSearchCedula(e.target.value)}
        />
        <input
          type="text"
          className="input-text"
          placeholder="Buscar por teléfono"
          value={searchTelefono}
          onChange={(e) => setSearchTelefono(e.target.value)}
        />
      </div>
      <ul className="mt-3 max-h-[105px] overflow-y-auto my-51">{content}</ul>
    </div>
  );
};

export default BuscarCliente;
