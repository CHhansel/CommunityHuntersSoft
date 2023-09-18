import { Link, Route, Routes, useLocation, useResolvedPath } from "react-router-dom";
import UserConfig from "../../views/Admin/UserConfig";
import Roles from "../../views/Admin/Roles";

const ConfigRouter = () => {
  const url = useResolvedPath("").pathname;
  const location = useLocation();

  return (
    <div className="w-100">
      <div className=" w-100 flex justify-center gap-7">
        <Link
          className={`ease-out duration-500 my-1 px-6 py-3 border-[0.1px] border-zinc-700 rounded-lg text-center ${location.pathname === url ? 'bg-gray-900 text-white' : 'hover:bg-gray-900 hover:text-white'}`}
          to={`${url}`}
        >
          User Config
        </Link>
        <Link
          className={`ease-out duration-500 my-1 px-6 py-3 border-[0.1px] border-zinc-700 rounded-lg text-center ${location.pathname.includes(`${url}/roles`) ? 'bg-gray-900 text-white' : 'hover:bg-gray-900 hover:text-white'}`}
          to={`${url}/roles`}
        >
          Roles
        </Link>
      </div>
      <div className="grow ">
        <Routes>
          <Route index element={<UserConfig />} />
          <Route path="/roles" element={<Roles />} />
        </Routes>
      </div>
    </div>
  );
};


export default ConfigRouter;
