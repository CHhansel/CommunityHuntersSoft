import { useEffect, useState } from "react";
import {
  allSaleConditionService,
  paymentMethodsService,
} from "../../../services/billingServices";
import { selectUser } from "../../../store/authSlice";
import { useSelector } from "react-redux";
import { formatCurrency } from "../../../utils/currency";

// eslint-disable-next-line react/prop-types
const BillData = ({ products, setpayCondition, setpaymentMethod }) => {
  const [productData, setProductData] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountReason, setDiscountReason] = useState("");
  const [saleConditions, setSaleConditions] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedpaymentMethod, setSelectedpaymentMethod] = useState("");
  const { token } = useSelector(selectUser);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setProductData(products);
    // Aquí asumimos que tienes un token para la autenticación

    allSaleConditionService
      .getSaleConditions(token)
      .then((data) => {
        setSaleConditions(data.salesConditions);
      })
      .catch((error) => {
        console.error("Error al obtener condiciones de venta:", error);
      });

    paymentMethodsService
      .getPaymentMethods(token)
      .then((data) => {
        setPaymentMethods(data.paymentMethods);
      })
      .catch((error) => {
        console.error("Error al obtener métodos de pago:", error);
      });
    setLoading(false);
    console.log("chacha", products);
  }, [products]);

  if (!productData) {
    return <div>Cargando...</div>;
  }
  const totals = products.reduce(
    (acc, product) => {
      const totalProductPrice = product.price * product.quantity;
      const isTaxed = product.tax_rate > 0;

      acc.totalCantidadProductos += product.quantity;
      acc.totalVenta += totalProductPrice;

      if (isTaxed) {
        acc.totalGravado += totalProductPrice;
        acc.impuestoTotal += totalProductPrice * (product.tax_rate / 100);
      } else {
        acc.totalExento += totalProductPrice;
      }

      return acc;
    },
    {
      totalCantidadProductos: 0,
      totalVenta: 0,
      totalGravado: 0,
      totalExento: 0,
      impuestoTotal: 0,
    }
  );

  // Asumiendo que no hay descuentos por ahora
  const descuentoTotal = 0;
  totals.totalVentaNeta = totals.totalVenta - descuentoTotal;
  // const totalBeforeDiscount =
  // productData.rent_amount +
  // productData.tax_amount +
  // productData.total_amount;
  // const discountAmount =
  //   totalBeforeDiscount *
  //   (Math.max(0, Math.min(discountPercentage, 100)) / 100);
  // const totalAfterDiscount = totalBeforeDiscount - discountAmount;

  if (loading) return <>Hola</>;

  return (
    !loading && (
      <div className="p-10 my-5 rounded-main bg-white border shadow">
        <div className="flex justify-around my-5">
          <div className="flex flex-col gap-3 ">
            <label htmlFor="saleCondition">Condición de Venta:</label>
            <select
              id="saleCondition"
              value={selectedCondition}
              onChange={(e) => {
                setSelectedCondition(e.target.value);
                setpayCondition(e.target.value);
              }}
              className="input-text"
            >
              {saleConditions.map((condition) => (
                <option key={condition.id} value={condition.codigo}>
                  {condition.condicion}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-3 ">
            <label htmlFor="paymentMethod">Método de pago:</label>
            <select
              id="paymentMethod"
              value={selectedpaymentMethod}
              onChange={(e) => {
                setSelectedpaymentMethod(e.target.value);
                setpaymentMethod(e.target.value);
              }}
              className="input-text"
            >
              {paymentMethods.map((method) => (
                <option key={method.codigo} value={method.codigo}>
                  {method.Descripcion}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* <table className="table-auto w-full mb-4 max-w-[1000px]">
          <tbody>
            <tr>
              <td className=" px-4">Descuento (%)</td>
              <td className=" px-4">
                <input
                  type="number"
                  className="input-text"
                  placeholder="Descuento"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  min="0"
                  max="100"
                />
              </td>
            </tr>
            <tr>
              <td className=" px-4 py-2">Razón del Descuento</td>
              <td className=" px-4 py-2">
                <input
                  type="text"
                  className="input-text"
                  placeholder="Motivo del Descuento"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className=" px-4">Precio total</td>
              <td className=" px-4">
                {formatCurrency(productData.price) || formatCurrency(0)}
              </td>
            </tr>
            <tr>
              <td className=" px-4">Impuestos</td>
              <td className=" px-4">{productData.tax_rate}</td>
            </tr>
            <tr>
              <td className=" px-4">Total Antes de Descuento</td>
              <td className=" px-4">{productData}</td>
            </tr>
            <tr>
              <td className=" px-4 py-2 font-bold">
                Total Después de Descuento
              </td>
              <td className=" px-4 py-2">1</td>
            </tr>
          </tbody>
        </table> */}
        <div>
          <p>Cantidad de productos: {totals.totalCantidadProductos}</p>
          <p>Total Gravado: {totals.totalGravado.toFixed(2)}</p>
          <p>Total Exento: {totals.totalExento.toFixed(2)}</p>
          <p>Total Venta: {totals.totalVenta.toFixed(2)}</p>
          <p>Descuento Total: {descuentoTotal.toFixed(2)}</p>
          <p>Total Venta Neta: {totals.totalVentaNeta.toFixed(2)}</p>
          <p>Impuesto Total: {totals.impuestoTotal.toFixed(2)}</p>
        </div>
      </div>
    )
  );
};

export default BillData;
