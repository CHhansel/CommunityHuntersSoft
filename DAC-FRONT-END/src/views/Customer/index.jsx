import { useState } from 'react';
import {TablaDinamica} from '../../components/Table/index'
import { PropiedadDetalle } from '../Property/PropertyDetails/index';

const Customer = () => {
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);

  const datos = [
    {
      "nombre": "Juan",
      "apellido": "Pérez",
      "dni": "12345678",

      "email": "juan.perez@email.com",
      "provincia": "Pichincha",
      "canton": "Quito",
      "distrito": "Centro",
      "direccion_exacta": "Calle Falsa 123",
      "nombre_empresa": "Empresa Juan",
      "nota": "Cliente frecuente"
    },
    {
      "nombre": "María",
      "apellido": "González",
      "dni": "87654321",

      "email": "maria.gonzalez@email.com",
      "provincia": "Guayas",
      "canton": "Guayaquil",
      "distrito": "Norte",
      "direccion_exacta": "Avenida Siempre Viva 456",
      "nombre_empresa": "Empresa María",
      "nota": "Cliente nuevo"
    },
    {
      "nombre": "Carlos",
      "apellido": "Rodríguez",
      "dni": "11223344",

      "email": "carlos.rodriguez@email.com",
      "provincia": "Azuay",
      "canton": "Cuenca",
      "distrito": "Sur",
      "direccion_exacta": "Callejón Sin Salida 789",
      "nombre_empresa": "Empresa Carlos",
      "nota": "Cliente VIP"
    },
    {
      "nombre": "Ana",
      "apellido": "Martínez",
      "dni": "99887766",

      "email": "ana.martinez@email.com",
      "provincia": "Loja",
      "canton": "Loja",
      "distrito": "Este",
      "direccion_exacta": "Plaza Central 101",
      "nombre_empresa": "Empresa Ana",
      "nota": "Cliente regular"
    },
    {
      "nombre": "Luis",
      "apellido": "Morales",
      "dni": "55667788",

      "email": "luis.morales@email.com",
      "provincia": "Manabí",
      "canton": "Portoviejo",
      "distrito": "Oeste",
      "direccion_exacta": "Bulevar Principal 202",
      "nombre_empresa": "Empresa Luis",
      "nota": "Cliente ocasional"
    }
  ]
  
  return (
    <div className='w-full px-16 flex flex-col justify-start h-full'> 
      <p>Clientes</p> 
      <TablaDinamica datos={datos} setFilaSeleccionada={setFilaSeleccionada} />
      {filaSeleccionada && <PropiedadDetalle fila={filaSeleccionada} />}
    </div>
  )
}

export default Customer

