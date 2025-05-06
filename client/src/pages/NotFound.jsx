import { Typography } from "@mui/material";
import DefaultContainer from "../components/DefaultContainer";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <DefaultContainer sx={{ height: "calc(100vh - 128px)", gap: 3 }}>
      <Typography variant="h1" sx={{ color: "var(--accent)", mb: -3 }}>
        404
      </Typography>
      <Typography variant="h2" sx={{ color: "var(--off-black)" }}>
        {t("notFound.subtitle")}
      </Typography>
      <Typography variant="body2">{t("notFound.description")}</Typography>
    </DefaultContainer>
  );
};

export default NotFound;
