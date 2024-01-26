import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/authSlice";
import { TablaDinamica } from "../../../components/Table";
import { RoleCreate } from "./RoleCreate";
import { RoleDetails } from "./RoleDetails";
import { useFetchRoles } from "../../../hooks/roles/useFetchRoles";

const Roles = () => {
  const [filaSeleccionada, setFilaSeleccionada] = useState(-1);
  const [createRoleActive, setCreateRoleActive] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { user } = useSelector(selectUser);
  const [page, setPage] = useState(1);
  // Utiliza el hook useFetchRoles para obtener los roles
  const { rolesData, isLoading, error } = useFetchRoles(
    user.company_id,
    page,
    10,
    reloadTrigger 
  );

  const { roles, totalRoles } = rolesData;

  if (isLoading) {
    return <div>Cargando Roles...</div>;
  }

  if (error) {
    return <div>Error al cargar los roles: {error}</div>;
  }

  // // propiedades Resumidas para la tabla
  // const rolesResume = JSON.parse(JSON.stringify(roles));
  // rolesResume.forEach((rol) => {
  //   delete rol.company_id;
  // });

  return (
    <div className="w-full px-16 flex flex-col justify-start h-full">
      <div className="w-100 flex justify-end px-8">
        <button
          onClick={() => {
            setFilaSeleccionada(-1), setCreateRoleActive(true);
          }}
          className="bg-main-blue px-6 py-2 border text-white rounded-full"
        >
          AGREGAR
        </button>
      </div>
      {roles && (
        <TablaDinamica
          datos={roles}
          setFilaSeleccionada={setFilaSeleccionada}
          dataType="Properties"
        />
      )}
      {filaSeleccionada >= 0 && (
        <RoleDetails
          key={roles[filaSeleccionada].id}
          fila={roles[filaSeleccionada]}
        />
      )}
      {createRoleActive && <RoleCreate></RoleCreate>}
    </div>
  );
};

export default Roles;
