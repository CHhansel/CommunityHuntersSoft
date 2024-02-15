import Swal from "sweetalert2";

import { useAlert } from "../../../../../components/Notifications/MySwalNotification";
import ProductForOrderView from "../../../../../components/productForOrderView";

const OrderSelection = ({ products, addProductToOrder }) => {
  const showToast = useAlert();

  const addProduct = async (item) => {
    const result = await Swal.fire({
      title: `Desea agregar ${item.name} a la orden`,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
    });
    if (result.isConfirmed) {
      try {
        addProductToOrder(item);
        showToast("success", "Producto agregado!");
      } catch (err) {
        console.error("Error agregando producto:", err);
      }
    }
  };
  return (
    <div className="p-3 my-5 rounded-main bg-white border shadow">
      <div className="flex flex-wrap gap-5 justify-evenly mt-7">
        {products.map((item) => (
          <div key={item.id} onClick={() => addProduct(item)}>
            <ProductForOrderView
              key={item.id}
              product={item}
            ></ProductForOrderView>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSelection;
