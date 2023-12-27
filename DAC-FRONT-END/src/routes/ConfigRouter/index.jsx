import { Link, Route, Routes, useLocation, useResolvedPath } from "react-router-dom";
import UserConfig from "../../views/Admin/UserConfig";
import Roles from "../../views/Admin/Roles";
import CompanySettings from "../../views/Admin/CompanySettings";
import ATVSettings from "../../views/Admin/ATVSettings";
import InvoiceCustomization from "../../views/Admin/InvoiceCustomization";

const ConfigRouter = () => {
  const url = useResolvedPath("").pathname;
  const location = useLocation();

  return (
    <div className="w-100 px-16">
      <div className=" w-100 flex justify-center gap-7">
        <Link
          className={`ease-out duration-500 my-1 px-6 py-3 border-[0.1px] border-zinc-700 rounded-lg text-center ${location.pathname === url ? 'bg-gray-900 text-white' : 'hover:bg-gray-900 hover:text-white'}`}
          to={`${url}`}
        >
          Usuario
        </Link>
        <Link
          className={`ease-out duration-500 my-1 px-6 py-3 border-[0.1px] border-zinc-700 rounded-lg text-center ${location.pathname.includes(`${url}/atv-settings`) ? 'bg-gray-900 text-white' : 'hover:bg-gray-900 hover:text-white'}`}
          to={`${url}/atv-settings`}
        >
          ATV
        </Link>
        <Link
          className={`ease-out duration-500 my-1 px-6 py-3 border-[0.1px] border-zinc-700 rounded-lg text-center ${location.pathname.includes(`${url}/company-settings`) ? 'bg-gray-900 text-white' : 'hover:bg-gray-900 hover:text-white'}`}
          to={`${url}/company-settings`}
        >
          Compañía
        </Link>
        <Link
          className={`ease-out duration-500 my-1 px-6 py-3 border-[0.1px] border-zinc-700 rounded-lg text-center ${location.pathname.includes(`${url}/roles`) ? 'bg-gray-900 text-white' : 'hover:bg-gray-900 hover:text-white'}`}
          to={`${url}/roles`}
        >
          Roles
        </Link>
        <Link
          className={`ease-out duration-500 my-1 px-6 py-3 border-[0.1px] border-zinc-700 rounded-lg text-center ${location.pathname.includes(`${url}/invoice`) ? 'bg-gray-900 text-white' : 'hover:bg-gray-900 hover:text-white'}`}
          to={`${url}/invoice`}
        >
          Factura
        </Link>

      </div>
      <div className="grow ">
        <Routes>
          <Route index element={<UserConfig />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/company-settings" element={<ATVSettings />} />
          <Route path="/atv-settings" element={<CompanySettings/>} />
          <Route path="/invoice" element={<InvoiceCustomization/>} />
        </Routes>
      </div>
    </div>
  );
};


export default ConfigRouter;
