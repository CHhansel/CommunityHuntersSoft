import { useEffect, useState } from 'react';
import {TablaDinamica} from '../../components/Table/index'
import { useDispatch, useSelector } from 'react-redux';

import { PropiedadDetalle } from './PropertyDetails';
import { fetchProperties } from '../../actions/properties';
import { selectUser } from '../../store/authSlice';

const Property = () => {
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const { user, token } = useSelector(selectUser);
  const id = user.id;
   const page = 1;
   const itemsPerPage = 3;
  
   const loading = useSelector(state => state.properties.loading);
   const error = useSelector(state => state.properties.error);
   const dispatch = useDispatch();
   useEffect(() => {
     
     dispatch(fetchProperties({id, page, itemsPerPage, token}));
    
    }, [dispatch]);
    const properties = useSelector(state => state.properties.properties);

  
  return (
    <div className='w-full px-16 flex flex-col justify-start h-full'> 
    {loading && <p>Cargando...</p>}
    {error && <p>Error: {error}</p>}
      <p>Propiedades</p> 
      <TablaDinamica datos={properties} setFilaSeleccionada={setFilaSeleccionada} />
      {filaSeleccionada && <PropiedadDetalle fila={filaSeleccionada} />}
    </div>
  )
}

export default Property