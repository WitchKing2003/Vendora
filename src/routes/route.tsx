import { Route, Routes } from "react-router-dom";
import MainLayout from "../pages/layouts/MainLayout";
import HomePage from "../pages/components/Home/HomePage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
