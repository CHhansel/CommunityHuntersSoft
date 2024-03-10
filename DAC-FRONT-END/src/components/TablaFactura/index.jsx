import React from 'react'
import FormattedCurrency from '../NumberFormat';

const TablaFactura = ({productos, updateProductQuantity}) => {

  console.log(productos);
  return (
    <div>
          <table className='w-full'>
      <thead className='mb-2 '>
        <tr className='w-full mb'>
          <th className='w-2/12 text-left'>Código</th>
          <th className='w-5/12 text-left'>Nombre de Producto</th>
          <th className='w-3/12 '>Cantidad</th>
          <th className='w-1/12 text-left'>IVA%</th>
          <th className='w-1/12 text-left'>Precio</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((item, index) => (
          <tr key={index}>
            <td className='w-2/12 text-xs'>{item.internal_code}</td>
            <td className='w-5/12 text-xs'>{item.name}</td>
            <td className='w-full text-xs flex items-center justify-center'>
                <button className='h-8 w-8 border' onClick={() => updateProductQuantity(item.id, false)}>-</button>
                <p className='mx-3 w-8 text-center text-sm'>
                   {item.quantityInOrder}
                  
                  </p>
                <button className='h-8 w-8 border text-2xl' onClick={() => updateProductQuantity(item.id)}>+</button>
              </td>
            <td className='w-1/12 text-xs'>{parseInt(item.tax_rate) + '%'}</td>
            <td className='w-1/12 text-xs'>              <FormattedCurrency amount={item.price}></FormattedCurrency>
</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  )
}

export default TablaFactura