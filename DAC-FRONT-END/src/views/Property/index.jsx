import { useSelector } from "react-redux";
import { TablaDinamica } from "../../components/Table/index";
import { PropertyDetail } from "./PropertyDetails";
import { PropertyCreate } from "./PropertyCreate";
import { selectUser } from "../../store/authSlice";
import Pagination from "../../components/pagination/pagination";
import { useFetchProperties } from "../../hooks/properties/useFetchProperties";
import { useState } from "react";
import { resumeData } from "../../utils/resumesForTable";
import { useAlert } from "../../components/Notifications/MySwalNotification";
import { Loading } from "../../components/loading";

const Property = () => {
  const [filaSeleccionada, setFilaSeleccionada] = useState(-1);
  const [createPropertyActive, setCreatePropertyActive] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);


  const { user } = useSelector(selectUser);
  const [page, setPage] = useState(1);
  const showToast = useAlert();
  // Traer las propiedades de la BD.
  const {
    propertyData: { properties, totalProperties },
    isLoading,
    error,
  } = useFetchProperties(user.company_id, page, 10, reloadTrigger);

  if (isLoading) {
    return <div className="h-80 "><Loading/></div>
    
  }
  
  if (error) {
    showToast('error', error);
    return <div className="h-80 "><Loading/></div>;
  }
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };
  
  const updateTable = () => {
    setFilaSeleccionada(-1);
    setCreatePropertyActive(false);
    setReloadTrigger(prev => prev + 1); // Incrementa el trigger para recargar

  };
  // propiedades Resumidas para la tabla
  const propertiesResume = resumeData(properties,'Properties');

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
      {propertiesResume && totalProperties > 0 && (
        <>
          <TablaDinamica
            datos={propertiesResume}
            setFilaSeleccionada={setFilaSeleccionada}
            dataType="Properties"
          />
          <Pagination
            totalItems={totalProperties}
            itemsPerPage={10}
            currentPage={page}
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
      {createPropertyActive && filaSeleccionada < 0 && (
        <PropertyCreate updateTable={updateTable} />
      )}
    </div>
  );
};

export default Property;
