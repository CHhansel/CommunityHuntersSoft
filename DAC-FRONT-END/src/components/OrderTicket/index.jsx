// OrderTicket.js
import React from 'react';

// eslint-disable-next-line react/display-name
export const ComponentToPrint = React.forwardRef((props, ref) => {
  const { order } = props;
  return (
    <div ref={ref} className='w-full p-0 m-0 bg-white' id='myPrintContainer'>
     <h1 className='pt-11 text-3xl font-bold mb-5'>Orden #{order.order_number}</h1>
      <h2>Mesa: {order.mesa}</h2>
      <div>
        {order.products.map((product, index) => (
          <div key={product.product_per_order_id}>
            <p>{index + 1}. {product.name}</p>
            <p>{product.comentarios}</p>
            <div className='w-full h-[0.2px] bg-slate-500'></div>
          </div>
        ))}
      </div>
      <h2>Total: ${order.total}</h2>
      <div className=' flex justify-center pt-11'>
        <p className=' text-xs text-wrap  w-full'>Powered By Community Hunters</p>

      </div>
      </div>
  );
});