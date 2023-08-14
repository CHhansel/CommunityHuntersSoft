import { Routes, Route } from "react-router-dom";
import { Login } from "../views/Login/Login";
import Footer from "../components/footer/index.jsX";

export const AppRouter = () => {
  return (
    <div className="h-screen flex flex-col ">
      <div className="flex flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};
