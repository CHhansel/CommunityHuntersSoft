import { useEffect, useState } from "react"


const BillData = ({property}) => {


    useEffect(() => {
      console.log("prop es",property);
      setPropertyData(property);

    }, [property])
    
    const [propertyData, setPropertyData] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountReason, setDiscountReason] = useState('');



  if (!propertyData) {
    return <div>Cargando...</div>;
  }

  const totalBeforeDiscount = propertyData.rent_amount + propertyData.tax_amount + propertyData.total_amount;
  const discountAmount = totalBeforeDiscount * (Math.max(0, Math.min(discountPercentage, 100)) / 100);
  const totalAfterDiscount = totalBeforeDiscount - discountAmount;

  return (
    <div className="p-10 my-5 rounded-main bg-white border shadow">
      <table className="table-auto w-full mb-4">
        <tbody>
          <tr>
            <td className="border px-4 py-2">Renta</td>
            <td className="border px-4 py-2">{propertyData.rent_amount}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Impuestos</td>
            <td className="border px-4 py-2">{propertyData.tax_amount}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Total Antes de Descuento</td>
            <td className="border px-4 py-2">{totalBeforeDiscount}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Descuento (%)</td>
            <td className="border px-4 py-2">
              <input 
                type="number" 
                className="border p-2"
                placeholder="Descuento" 
                value={discountPercentage}
                onChange={e => setDiscountPercentage(e.target.value)}
                min="0"
                max="100"
              />
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Razón del Descuento</td>
            <td className="border px-4 py-2">
              <input 
                type="text" 
                className="border p-2 w-full"
                placeholder="Motivo del Descuento" 
                value={discountReason}
                onChange={e => setDiscountReason(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-bold">Total Después de Descuento</td>
            <td className="border px-4 py-2">{totalAfterDiscount}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};


export default BillData