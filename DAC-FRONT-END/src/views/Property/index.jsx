import { useState } from 'react';
import {TablaDinamica} from '../../components/Table/index'
import { PropiedadDetalle } from './PropertyDetails';

const Property = () => {
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);

  const datos = [
    {
      "Nombre": "Casa en la Playa",
      "description": "Hermosa casa frente al mar con 3 habitaciones",
      "Estado": "Activo",
      "province": "Guanacaste",
      "canton": "Santa Cruz",
      "district": "Tamarindo",
      "exactAddress": "Frente al Hotel Tamarindo",
    },
    {
      "Nombre": "Apartamento en la Ciudad",
      "description": "Apartamento moderno en el centro de la ciudad con 2 habitaciones",
      "Estado": "Activo",
      "province": "San José",
      "canton": "San José",
      "district": "Pavas",
      "exactAddress": "Calle 5, Avenida 8",
    },
    {
      "Nombre": "Cabaña en la Montaña",
      "description": "Cabaña acogedora en la montaña con vistas impresionantes",
      "Estado": "Activo",
      "province": "Cartago",
      "canton": "Turrialba",
      "district": "Santa Cruz",
      "exactAddress": "Kilómetro 10, Carretera a la Suiza",
    }
  ]
  
  return (
    <div className='w-full px-16 flex flex-col justify-start h-full'> 
      <p>Propiedades</p> 
      <TablaDinamica datos={datos} setFilaSeleccionada={setFilaSeleccionada} />
      {filaSeleccionada && <PropiedadDetalle fila={filaSeleccionada} />}
    </div>
  )
}

export default Property