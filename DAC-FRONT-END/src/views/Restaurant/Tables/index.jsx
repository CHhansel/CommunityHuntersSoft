import React, { useState, useEffect, useCallback } from "react";
import Button from "../../../components/buttons/Button/index";
import PopUp from "../../../components/popUp";
import RestaurantTableCreate from "./CreateTable";
import { useFetchRestaurantTables } from "../../../hooks/tables/fetchRestaurantTables";
import { TablaDinamica } from "../../../components/Table";
import { resumeData } from "../../../utils/resumesForTable";

const Tables = () => {
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [filaSeleccionada, setfilaSeleccionada] = useState(-1);
  const company_id = 1; // Asumiendo que tienes un company_id definido, ajusta según tu implementación
  const { tablesData, isLoading, error } = useFetchRestaurantTables(
    company_id,
    reloadTrigger
  );

  const togglePopUp = () => {
    setSelectedTable(null);
    setPopUpOpen((prev) => !prev);
    setfilaSeleccionada(-1);
  };
  useEffect(() => {
    if (filaSeleccionada > -1) {
      togglePopUp();
      setSelectedTable(tablesData.tables[filaSeleccionada]);
    }
  }, [filaSeleccionada]);

  const handleReloadTables = () => {
    setReloadTrigger((prev) => !prev); // Esto recargará las mesas cuando se llame
  };
  // Aquí puedes manejar el estado de carga y error si lo deseas, por ejemplo, mostrando indicadores de carga o mensajes de error.
  const tablesDataResume = resumeData(tablesData.tables, "Tables");

  return (
    <div className="w-full px-16 flex flex-col justify-start h-full">
      <div className="flex items-center w-full justify-between">
        <h2 className="text-2xl text-main-blue">Mesas</h2>
        <Button type="ADD" onClick={togglePopUp} text={"MESA"}/>
      </div>

      {isLoading && <p>Cargando mesas...</p>}
      {error && <p>Ha ocurrido un error al cargar las mesas</p>}

      <div className="w-80">
        <PopUp isOpen={isPopUpOpen} onClose={togglePopUp}>
          <RestaurantTableCreate
            onClose={togglePopUp}
            onCreated={handleReloadTables}
            selectedTable={selectedTable}
          ></RestaurantTableCreate>
        </PopUp>
      </div>

      {tablesData.tables && (
        <TablaDinamica
          datos={tablesDataResume}
          setFilaSeleccionada={setfilaSeleccionada}
          dataType="Table"
        />
      )}
    </div>
  );
};

export default Tables;
