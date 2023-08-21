import { Link, useLocation } from 'react-router-dom';
import arrow from '../../assets/arrow-forward.svg'
const Breadcrumb = () => {
  const location = useLocation();


  const getBreadcrumbs = (path) => {
    const parts = path.split('/').filter(Boolean);
    return parts.map((part, index) => ({
      path: '/' + parts.slice(0, index + 1).join('/'),
      name: part,
    }));
  };
  const breadcrumbs = getBreadcrumbs(location.pathname);
  return (
    <nav className='flex px-14 py-3'>
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={breadcrumb.path} className='text-lg flex items-center'> 
          <Link to={breadcrumb.path} >{breadcrumb.name}</Link>
          {index < breadcrumbs.length - 1 && <img  src={arrow} className='mx-2 inline w-5'></img>}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
