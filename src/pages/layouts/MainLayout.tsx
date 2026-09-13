import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <div className="Header">Header</div>

      <Outlet />

      <div className="Footer">Footer</div>
    </>
  );
};

export default MainLayout;
