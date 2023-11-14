import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { TablaDinamica } from "../../components/Table/index";
import { PropertyDetail } from "./PropertyDetails";
import { PropertyCreate } from "./PropertyCreate";
import { selectUser } from "../../store/authSlice";
import Pagination from "../../components/pagination/pagination";
import { PropertyService } from "../../services/propertyServices";

const Property = () => {
  const [filaSeleccionada, setFilaSeleccionada] = useState(-1);
  const [createPropertyActive, setCreatePropertyActive] = useState(false);
  const [properties, setProperties] = useState([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user, token } = useSelector(selectUser);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const data = await PropertyService.getPropertiesByCompanyId(
          token,
          user.company_id,
          currentPage,
          10
        );
        setProperties(data.properties); // Asegúrate de ajustar según la estructura de tu respuesta
        setTotalProperties(data.totalProperties); // Ajusta según la estructura de tu respuesta
        setError(null);
      } catch (error) {
        setError('Error al cargar las propiedades');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [currentPage, user.company_id, token]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Cargando Propiedades ...</div>;
  }

  const updateTable = () => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const data = await PropertyService.getPropertiesByCompanyId(
          token,
          user.company_id,
          currentPage,
          10
        );
        setProperties(data.properties); // Asegúrate de ajustar según la estructura de tu respuesta
        setTotalProperties(data.totalProperties); // Ajusta según la estructura de tu respuesta
        setError(null);
      } catch (error) {
        setError('Error al cargar las propiedades');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  };
  // if (error) {
  //   return <div>Error al cargar las propiedades</div>;
  // }

  // propiedades Resumidas para la tabla
  const propertiesResume = JSON.parse(JSON.stringify(properties));
  propertiesResume.forEach((property) => {
    delete property.customer_id;
    delete property.start_date;
    delete property.start_date;
    delete property.end_date;
    delete property.start_date;
    delete property.deposit_amount;
    delete property.rent_amount;
    delete property.tax_amount;
    delete property.total_amount;
    delete property.payment_method;
    delete property.payment_date;
    delete property.contract_file;
    delete property.payment_method;
    delete property.creation_date;
    delete property.company_id;
    delete property.exact_address;
    delete property.antiquity;
    delete property.description;
    delete property.customer_dni;
    delete property.dni_type_description;
  });
  return (
    
    <div className="w-full px-16 flex flex-col justify-start h-full ">
      <div className="w-100 flex justify-end px-8">
        <button
          onClick={() => {
            setFilaSeleccionada(-1), setCreatePropertyActive(true);
          }}
          className="bg-main-blue px-6 py-2 border text-white rounded-full"
        >
          AGREGAR
        </button>
      </div>
      {propertiesResume && totalProperties > 0 &&(
        <>
          <TablaDinamica
            datos={propertiesResume}
            setFilaSeleccionada={setFilaSeleccionada}
            dataType="Properties"
          />
          <Pagination
            totalItems={totalProperties}
            itemsPerPage={10}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
      {filaSeleccionada >= 0 && (
        <PropertyDetail
          key={properties[filaSeleccionada].id}
          fila={properties[filaSeleccionada]}
          updateTable={updateTable}
        />
      )}
      {createPropertyActive && filaSeleccionada < 0 && <PropertyCreate updateTable={updateTable} />}
    </div>
  );
};

export default Property;
