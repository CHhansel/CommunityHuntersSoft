import React, { useState } from "react";
import TablaFactura from "../../../components/TablaFactura";
import FormattedCurrency from "../../../components/NumberFormat";
import BuscarCliente from "../../../components/BuscarCliente";
import useFetchEmployeesByModuleAndCompany from "../../../hooks/employees/useFetchEmployeeByModuleAndCompany";

const DetalleFactura = ({
  selectedProducts,
  updateProductQuantity,
  cliente,
  setCliente,
  data,
  setData,
  facturar,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const handlePaymentChange = (paymentMethod) => {
    setData({ ...data, metodoPago: paymentMethod });
  };

  const {
    employeesData,
    loading: loadingEmployees,
    error: errorEmployees,
  } = useFetchEmployeesByModuleAndCompany(6, 1);

  const handleElectronicInvoiceChange = () => {
    setData({ ...data, facturaElectronica: !data.facturaElectronica });
  };
  return (
    <div className="box-style w-full h-full relative">
      <h2 className="font-bold">Resumen de la factura</h2>
      <hr className="mb-5" />
      <div className="inputs flex justify-between flex-wrap">
        <div className="left-inputs ">
          <div className="metodo-pago flex flex-col gap-2">
            <h3 className="text-md font-bold">Método de Pago</h3>
            <div className="flex gap-5 pl-5">
              <label>
                <input
                  type="radio"
                  name="metodoPago"
                  value="01"
                  checked={data.metodoPago === "01"}
                  onChange={() => handlePaymentChange("01")}
                />{" "}
                Efectivo
              </label>
              <label>
                <input
                  type="radio"
                  name="metodoPago"
                  value="02"
                  checked={data.metodoPago === "02"}
                  onChange={() => handlePaymentChange("02")}
                />{" "}
                Tarjeta
              </label>
              <label>
                <input
                  type="radio"
                  name="metodoPago"
                  value="04"
                  checked={data.metodoPago === "04"}
                  onChange={() => handlePaymentChange("04")}
                />{" "}
                Transferencia
              </label>
            </div>
          </div>
          <div className=" flex flex-col gap-2 mt-5">
            <h3 className="text-md font-bold">Factura Electrónica</h3>
            <div className="flex gap-5 pl-5">
              <label>
                <input
                  type="checkbox"
                  checked={data.facturaElectronica}
                  onChange={handleElectronicInvoiceChange}
                />{" "}
                Sí
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={!data.facturaElectronica}
                  onChange={handleElectronicInvoiceChange}
                />{" "}
                No
              </label>
            </div>
          </div>
        </div>
        <div className="rigth-inputs">
          <div className="flex flex-col gap-3">
            <label htmlFor="employeeSelect">Seleccionar Empleado</label>
            <select
              id="employeeSelect"
              className="input-text-sm"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">Empleados</option>
              {loadingEmployees ? (
                <option>Cargando empleados...</option>
              ) : errorEmployees ? (
                <option>Error al cargar empleados</option>
              ) : (
                employeesData.employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.user_name}{" "}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>
      <div>
        {data.facturaElectronica && (
          <>
            <BuscarCliente setCliente={setCliente}></BuscarCliente>
            {cliente && (
              <div>
                <p>{cliente.name}</p>
                <p>{cliente.dni}</p>
              </div>
            )}
          </>
        )}
      </div>
      <div className="mt-10 ">
        Productos
        <hr className="mb-5" />
        <TablaFactura
          productos={selectedProducts}
          updateProductQuantity={updateProductQuantity}
        ></TablaFactura>
        <div className="flex w-full items-end flex-col mt-5">
          <div className="flex w-[200px] justify-between">
            <p>Subtotal </p>
            <FormattedCurrency amount={data.subtotal}></FormattedCurrency>
          </div>
          <div className="flex w-[200px] justify-between">
            <p>I.V.A </p>
            <FormattedCurrency amount={data.IVA}></FormattedCurrency>
          </div>
          <div className="flex w-[200px] justify-between text-lg font-bold">
            <p>Total </p>
            <FormattedCurrency amount={data.total}></FormattedCurrency>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleFactura;
