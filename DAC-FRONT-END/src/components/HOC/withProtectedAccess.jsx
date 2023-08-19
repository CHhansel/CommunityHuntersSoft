import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const withProtectedAccess = (WrappedComponent, module_id) => {
  const WithProtectedAccess = (props) => {
    const accessibleModules = useSelector((state) => state.modules.accessibleModules);
      // Si ha ocurrido un error, muestra un mensaje de error
    const hasAccess = accessibleModules.accessModules.some((module) => module.module_id === module_id);

    if (hasAccess) {
      return <WrappedComponent {...props} />;
    } else {
      return <Navigate to="/dashboard" replace={true} />
    }
  };

  WithProtectedAccess.displayName = `WithProtectedAccess(${getDisplayName(WrappedComponent)})`;

  return WithProtectedAccess;
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withProtectedAccess;



