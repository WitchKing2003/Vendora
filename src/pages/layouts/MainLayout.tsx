import { Outlet } from "react-router-dom";
import HeaderPage from "../components/Home/Header/HeaderPage";
import FooterPage from "../components/Home/Footer/FooterPage";

const MainLayout = () => {
  return (
    <>
      <div className="Header">
        <HeaderPage />
      </div>

      <Outlet />

      <div className="Footer">
        <FooterPage />
      </div>
    </>
  );
};

export default MainLayout;
