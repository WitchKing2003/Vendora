import { Outlet } from "react-router-dom";
import HeaderPage from "../components/Home/Header/HeaderPage";

const MainLayout = () => {
  return (
    <>
      <div className="Header">
        <HeaderPage />
      </div>

      <Outlet />

      <div className="Footer">Footer</div>
    </>
  );
};

export default MainLayout;
