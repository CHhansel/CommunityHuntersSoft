import { Link, useLocation } from 'react-router-dom';
import arrow from '../../assets/arrow-forward.svg'
import home from '../../assets/home-icon.svg'
import { translateRoutes } from '../../utils/breadcrumsTranslate';
const Breadcrumb = () => {
  const location = useLocation();


  const getBreadcrumbs = (path) => {
    const parts = path.split('/').filter(Boolean);
    return parts.map((part, index) => ({
      path: '/' + parts.slice(0, index + 1).join('/'),
      name: part,
    }));
  };
  const bread = getBreadcrumbs(location.pathname);
  const breadcrumbs = translateRoutes(bread)
  return (
    <nav className='flex px-14 py-3'>
      <img src={home} className='w-4 mx-2'></img>
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={breadcrumb.path} className='text-sm flex items-center'> 
        
          <Link to={breadcrumb.path} >{breadcrumb.name}</Link>
          {index < breadcrumbs.length - 1 && <img  src={arrow} className='mx-1 inline w-4'></img>}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
