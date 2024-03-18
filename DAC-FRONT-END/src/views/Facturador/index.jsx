import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchProductsByCompanyId } from "../../hooks/products/useFetchProducts";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/authSlice";
import ProductsSelector from "../Products/ProductsSelector";
import DetalleFactura from "./DetalleFactura";
import { invoiceService } from "../../services/billingServices";
import Button from "../../components/buttons/Button";
import { useAlert } from "../../components/Notifications/MySwalNotification";
import { Loading } from "../../components/loading";
import Swal from "sweetalert2";

const Facturador = () => {
  const { user, token } = useSelector(selectUser);
  const showToast = useAlert();
  const [reloadTrigger] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cargandoFactura, setgenerandoFactura] = useState(false);
  const [cliente, setCliente] = useState({});
  const [data, setData] = useState({
    facturaElectronica: "01",
    CondicionDeVenta: "01",
    metodoPago: "01",
    LineaDeDetalle: [],
    total: 0,
    subtotal: 0,
    IVA: 0,
  });
  const {
    productsData: { products },
  } = useFetchProductsByCompanyId(user.company_id, 1, 10, reloadTrigger);

  const addProduct = (item) => {
    setSelectedProducts((currentProducts) => {
      // Verificamos si el producto ya existe en el arreglo.
      const existingProductIndex = currentProducts.findIndex(
        (p) => p.id === item.id
      );
      console.log(selectedProducts);
      if (existingProductIndex !== -1) {
        // Si el producto existe, creamos un nuevo arreglo con la cantidad actualizada.
        return currentProducts.map((p, index) => {
          if (index === existingProductIndex) {
            return { ...p, quantityInOrder: p.quantityInOrder + 1 };
          }
          return p;
        });
      } else {
        // Si el producto no existe, lo añadimos con una cantidad inicial de 1.
        return [...currentProducts, { ...item, quantityInOrder: 1 }];
      }
    });
  };
  const validateAndInvoice = async () => {
  // Verificar si hay productos seleccionados
  if (selectedProducts.length === 0) {
    showToast('error', 'Debe seleccionar al menos un producto.');
    return;
  }
  
  // Verificar si la factura es electrónica y si hay un cliente seleccionado
  if (data.facturaElectronica === "01" && Object.keys(cliente).length === 0) {
    showToast('error', 'Debe seleccionar un cliente para la factura electrónica.');
    return;
  }
  
  // Si las validaciones son correctas, proceder a facturar
  await invoice();
};

// Y luego cambias la referencia en el botón:
<Button type="PAY" onClick={validateAndInvoice}></Button>

  const updateProductQuantity = (productId, increment = true) => {
    setSelectedProducts((currentProducts) => {
      return currentProducts
        .map((product) => {
          if (product.id === productId) {
            return {
              ...product,
              quantityInOrder: increment
                ? product.quantityInOrder + 1
                : product.quantityInOrder - 1,
            };
          }
          return product;
        })
        .filter((product) => product.quantityInOrder > 0); // Elimina productos con cantidad 0.
    });
  };
  const calculateOrderTotals = () => {
    let subtotal = 0;
    let IVA = 0;
    let total = 0;
    selectedProducts.forEach((product) => {
      const priceWithIVA = parseFloat(product.price);
      const taxRate = parseFloat(product.tax_rate) / 100;
      const quantity = product.quantityInOrder;

      const priceWithoutIVA = priceWithIVA / (1 + taxRate);
      const ivaAmount = priceWithIVA - priceWithoutIVA;

      subtotal += priceWithoutIVA * quantity;
      IVA += ivaAmount * quantity;
      total += priceWithIVA * quantity;
    });

    // Aquí podrías actualizar el estado con los nuevos totales
    setData((prevData) => ({
      ...prevData, // Copia todos los campos existentes en data
      subtotal, // Agrega o actualiza el campo subtotal
      IVA, // Agrega o actualiza el campo IVA
      total, // Agrega o actualiza el campo total
    }));
  };

  // Llama a calculateOrderTotals cada vez que selectedProducts cambie
  useEffect(() => {
    calculateOrderTotals();
  }, [selectedProducts]);

  const prepareInvoiceData = () => {
    const invoiceData = {
      company_id: user.company_id,
      Cliente: {
        id: 21,
        nombre: cliente.name,
        tipoIdentificacion: cliente.dni_type,
        identificacion: cliente.dni,
        email: cliente.email,
      },
      LineaDeDetalle: selectedProducts,
      MedioDePago: data.metodoPago,
      CondicionDeVenta: data.CondicionDeVenta,
      facturaElectronica: data.facturaElectronica,
    };

    return invoiceData;
  };
  const invoice = async () => {
    //e.preventDefault();
    try {
      const result = await Swal.fire({
        title: "¿Desea Facturar esta orden?",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
      });
      if (!result.isConfirmed){
        return null;
      }
      // Prepara los datos de la factura
      setgenerandoFactura(true);
      const invoiceData = prepareInvoiceData();

      // Llama al servicio de facturación y espera por la respuesta

      const response = await invoiceService.createInvoice(token, invoiceData);
      // Para descargar el archivo
      const downloadLink = document.createElement("a");
      downloadLink.href = response.pdfUrl;
      downloadLink.download = "factura.pdf"; // El nombre que quieres que tenga el archivo descargado
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // O para abrir en una nueva pestaña
      window.open(response.pdfUrl, "_blank");
      console.log("Factura creada con éxito", response);
      setSelectedProducts([]);
      setCliente({});
      showToast("success", "Factura generada!");
      setgenerandoFactura(false);
      // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
    } catch (error) {
      console.error("Error al crear la factura", error);
      // Aquí podrías manejar el error, por ejemplo, mostrar un mensaje al usuario
    }
  };
  return (
    <div>
      <div className="  px-16 flex gap-5 flex-row justify-between h-[86vh] ">
        <div className="w-1/2 h-full">
          <ProductsSelector products={products} selectProduct={addProduct} />
        </div>
        <div className="w-1/2 h-[86vh]">
        {cargandoFactura && (
            <>
            <Loading message="Creando Factura"></Loading>
            </>
          )}
          {!cargandoFactura && (
            <>
              <div className="h-[80vh]">
                <DetalleFactura
                  selectedProducts={selectedProducts}
                  updateProductQuantity={updateProductQuantity}
                  data={data}
                  setData={setData}
                  cliente={cliente}
                  setCliente={setCliente}
                  facturar={invoice}
                />
              </div>
              <div className="h-[6vh] flex justify-end   items-center">
                 <Button type="PAY" onClick={validateAndInvoice}></Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Facturador;