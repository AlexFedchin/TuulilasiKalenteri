import { Box, Typography } from "@mui/material";
import useScreenSize from "../hooks/useScreenSize";
import { useTranslation } from "react-i18next";

const CustomFooter = () => {
  const { isMobile } = useScreenSize();
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        justifyContent: "center",
        backgroundColor: "var(--white)",
        p: 3,
        pt: 4,
        mt: 4,
        boxShadow: "0 -8px 16px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <a
          href="https://tuulilasipojat.fi/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            height: "fit-content",
            padding: 0,
          }}
        >
          <img
            src="/logo.webp"
            draggable="false"
            alt={t("footer.tuulilasiPojatLogoAlt")}
            style={{
              maxWidth: isMobile ? "120px" : "150px",
              height: "auto",
              cursor: "pointer",
            }}
          />
        </a>
        <a
          href="https://tuulilasitukku.fi"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            height: "fit-content",
            padding: 0,
          }}
        >
          <img
            src="/tuulilasitukku-logo.webp"
            draggable="false"
            alt={t("footer.tuulilasiTukkuLogoAlt")}
            style={{
              maxWidth: isMobile ? "120px" : "150px",
              height: "auto",
              cursor: "pointer",
            }}
          />
        </a>
      </Box>
      <Typography
        variant="h5"
        fontWeight={400}
        sx={{ color: "var(--off-grey)" }}
      >
        © {new Date().getFullYear()} {t("footer.copyright")}
      </Typography>
    </Box>
  );
};
export default CustomFooter;
