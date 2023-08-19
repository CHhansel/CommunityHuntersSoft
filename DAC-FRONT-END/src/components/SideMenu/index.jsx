
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Property from '../../views/Property';
import { Link, useResolvedPath } from 'react-router-dom';

const SideMenu = ( { accessModules }) => {
  const url = useResolvedPath("").pathname;
  const accessibleModules = useSelector((state) => state.modules.accessibleModules.accessModules);

  const allModules = {
    1: { name: 'Propiedades', path: 'properties', component: Property },
    2: { name: 'Clientes', path: 'clients', component: Property },
    3: { name: 'Contratos', path: 'contracts', component: Property },
    4: { name: 'Facturas', path: 'bills', component: Property },
    // Agrega más módulos según sea necesario
  };
  console.log("holas ",accessModules);
  return (
    <div className="sidebar">
    {accessibleModules.map((module) => {
      console.log("modulo es ", allModules[module.module_id]);
      const { name, path: modulePath } = allModules[module.module_id];
      return <Link key={module.module_id} to={`${url}/${modulePath}`}>{name}</Link>;
    })}
  </div>
  )
}
SideMenu.propTypes = {
  accessModules: PropTypes.array.isRequired
};

export default SideMenu