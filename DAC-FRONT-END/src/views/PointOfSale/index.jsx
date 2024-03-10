import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetchOrderWithProducts from "../../hooks/orders/useFetchOrderWithProducts";
import FormattedCurrency from "../../components/NumberFormat";

const PointOfSale = () => {
  let { ordenId } = useParams();
  const { orderWithProducts } = useFetchOrderWithProducts(ordenId);
  const [metodoPago, setMetodoPago] = useState("Efectivo"); // 'Efectivo', 'Tarjeta', o 'Transferencia'
  const [facturaElectronica, setFacturaElectronica] = useState(false); // true para sí, false para no
  const [selectedProducts, setSelectedProducts] = useState({});

  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (orderWithProducts) {
      // Inicializar todos los productos como seleccionados
      const initialSelectedProducts = orderWithProducts.productsResult.reduce(
        (acc, product) => ({ ...acc, [product.id]: true }), // Todos seleccionados inicialmente
        {}
      );
      setSelectedProducts(initialSelectedProducts);
    }
  }, [orderWithProducts]);

  useEffect(() => {
    if (orderWithProducts) {
      const calculatedSubTotal = orderWithProducts.productsResult.reduce(
        (acc, product) => {
          if (selectedProducts[product.id]) {
            const taxRateDecimal = Number(product.tax_rate) / 100;
            const precioSinImpuesto = Number(product.product_price) / (1 + taxRateDecimal);
            return acc + precioSinImpuesto; // No multiplicamos por quantity
          }
          return acc;
        },
        0
      );
  
      const calculatedTotal = orderWithProducts.productsResult.reduce(
        (acc, product) => {
          if (selectedProducts[product.id]) {
            return acc + Number(product.product_price); // No multiplicamos por quantity
          }
          return acc;
        },
        0
      );
  
      setSubTotal(calculatedSubTotal);
      setTotal(calculatedTotal);
    }
  }, [orderWithProducts, selectedProducts]);
  

  const handleProductSelection = (productId) => {
    setSelectedProducts((prevSelectedProducts) => ({
      ...prevSelectedProducts,
      [productId]: !prevSelectedProducts[productId],
    }));
  };

  console.log(orderWithProducts);
  const getOrderTypeText = (type) => {
    switch (type) {
      case 1:
        return "Para llevar";
      case 2:
        return "Express";
      case 3:
        return "Comer Acá";
      default:
        return "Tipo desconocido";
    }
  };

  return (
    <div className="w-full px-16 flex flex-col justify-start h-full">
      {orderWithProducts && (
        <div>
          <h2 className="text-lg font-bold">Factura de Orden</h2>
          <p className="">
            Tipo de Orden: {getOrderTypeText(orderWithProducts.type)}
          </p>
          <p>Número de Orden: {orderWithProducts.order_number}</p>
          <div className="metodo-pago flex gap-5">
            <h3 className="text-md font-bold">Método de Pago</h3>
            <label>
              <input
                type="radio"
                name="metodoPago"
                value="Efectivo"
                checked={metodoPago === "Efectivo"}
                onChange={() => setMetodoPago("Efectivo")}
              />{" "}
              Efectivo
            </label>
            <label>
              <input
                type="radio"
                name="metodoPago"
                value="Tarjeta"
                checked={metodoPago === "Tarjeta"}
                onChange={() => setMetodoPago("Tarjeta")}
              />{" "}
              Tarjeta
            </label>
            <label>
              <input
                type="radio"
                name="metodoPago"
                value="Transferencia"
                checked={metodoPago === "Transferencia"}
                onChange={() => setMetodoPago("Transferencia")}
              />{" "}
              Transferencia
            </label>
          </div>

          <div className="factura-electronica flex gap-5">
            <h3 className="text-md font-bold">Factura Electrónica</h3>
            <label>
              <input
                type="checkbox"
                checked={facturaElectronica}
                onChange={() => setFacturaElectronica(!facturaElectronica)}
              />{" "}
              Sí
            </label>
            <label>
              <input
                type="checkbox"
                checked={!facturaElectronica}
                onChange={() => setFacturaElectronica(!facturaElectronica)}
              />{" "}
              No
            </label>
          </div>
          <div className="mt-4">
            <h3 className="text-md font-bold">Productos</h3>
            <div>
              <div className="flex justify-between bg-slate-200 px-3 py-2 rounded-main">
                <div className="w-2/12">
                  <p className="">Código:</p>
                </div>
                <div className="w-6/12">
                  <p className="">Producto:</p>
                </div>
                <div className="w-2/12">
                  <p className="">Precio:</p>
                </div>
                <div className="w-2/12">
                  <p className="">IVA:</p>
                </div>
              </div>
              {orderWithProducts.productsResult.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts[product.id]} // Se inicializa según el estado
                    onChange={() => handleProductSelection(product.id)}
                  />
                  <p className="w-2/12 "> {product.product_internal_code}</p>
                  <p className="w-6/12 "> {product.product_name}</p>
                  <div className="w-2/12">
                    <FormattedCurrency amount={product.product_price} />
                  </div>
                  <p className="w-2/12">{product.tax_rate}%</p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex flex-col items-end mt-12 justify-end">
            <p className="flex">
              Subtotal : <FormattedCurrency amount={subTotal} />
            </p>
            <p className="flex">
              Total : <FormattedCurrency amount={total} />
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointOfSale;
