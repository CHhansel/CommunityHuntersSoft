import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

const withProtectedAccess = (WrappedComponent, moduleUrl) => {
  const WithProtectedAccess = (props) => {
    const accessibleModules = useSelector((state) => state.accessibleModules);

    const hasAccess = accessibleModules.some((module) => module.url === moduleUrl);

    if (hasAccess) {
      return <WrappedComponent {...props} />;
    } else {
      return <Redirect to="/error" />;
    }
  };

  WithProtectedAccess.displayName = `WithProtectedAccess(${getDisplayName(WrappedComponent)})`;

  return WithProtectedAccess;
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withProtectedAccess;

