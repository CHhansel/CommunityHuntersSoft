import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "../../../actions/roles";
import { selectUser } from "../../../store/authSlice";
import { TablaDinamica } from "../../../components/Table";
import { RoleCreate } from "./RoleCreate";

const Roles = () => {
  const [filaSeleccionada, setFilaSeleccionada] = useState(-1);
  const [createRoleActive, setCreateRoleActive] = useState(false);

  const { user, token } = useSelector(selectUser);
  const dispatch = useDispatch();

  const totalRoles = useSelector((state) => state.roles.totalRoles);
  useEffect(() => {
    dispatch(
      fetchRoles({
        id: 1,
        page: 1,
        itemsPerPage: 10,
        token,
      })
    );
  }, [dispatch, user.id, token, totalRoles]);
  const roles = useSelector((state) => state.roles.roles);
  const status = useSelector((state) => state.roles.status);
  if (status === "loading" || status === "idle") {
    return <div>Cargando Roles ... {status}</div>;
  }
  return (
    <div className="w-full px-16 flex flex-col justify-start h-full">
      Roles
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
      <TablaDinamica
        datos={roles}
        setFilaSeleccionada={setFilaSeleccionada}
        dataType="Properties"
      />
      {createRoleActive &&  <RoleCreate></RoleCreate>}
      
    </div>
  );
};

export default Roles;
