import { useTranslation } from "react-i18next";
import HighlightSlider from "./HighlightSlider/HighlightSlider";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="">
      <HighlightSlider />
      <div className="px-4 py-10 text-center">{t("welcome")}</div>
    </div>
  );
};

export default HomePage;
