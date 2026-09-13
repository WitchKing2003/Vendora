// import { useState } from "react";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();

  return <div className="">{t("welcome")}</div>;
};

export default HomePage;
