import { Link, Route, Routes, useResolvedPath } from "react-router-dom";
import UserConfig from "../../views/Admin/UserConfig";
import Roles from "../../views/Admin/Roles";

const ConfigRouter = () => {
  const url = useResolvedPath("").pathname;
  return (
    <div> 
      <Link className=" my-1 w-full p-3 border-[0.1px] border-zinc-700 rounded-lg text-center hover:bg-gray-900"
      to={`${url}/`}>
        user Config
      </Link>
      <Link className=" my-1 w-full p-3 border-[0.1px] border-zinc-700 rounded-lg text-center hover:bg-gray-900"
      to={`${url}/roles`}>
        Roles
      </Link>
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
