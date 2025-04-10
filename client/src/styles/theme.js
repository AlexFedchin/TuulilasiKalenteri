import { createTheme } from "@mui/material/styles";

const createCustomTheme = ({ isMobile, isTablet }) =>
  createTheme({
    typography: {
      fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          body1: {
            fontSize: isMobile ? "0.875rem" : isTablet ? "1rem" : "1.125rem",
            fontWeight: 400,
          },
          body2: {
            fontSize: isMobile ? "0.75rem" : isTablet ? "0.875rem" : "1rem",
            fontWeight: 400,
            color: "var(--off-grey)",
          },
          h1: {
            fontSize: isMobile ? "2rem" : isTablet ? "2.5rem" : "3rem",
            fontWeight: 800,
          },
          h2: {
            fontSize: isMobile ? "1.5rem" : isTablet ? "2rem" : "2.5rem",
            fontWeight: 700,
          },
          h3: {
            fontSize: isMobile ? "1.25rem" : isTablet ? "1.5rem" : "2rem",
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(255, 255, 255, 0.01)",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            textAlign: "left",
            "&:hover": {
              boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
            "&:active": {
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              backgroundColor: "rgba(255, 255, 255, 0.035)",
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "4px",
            ".MuiOutlinedInput-notchedOutline": {
              transition: "all 0.2s ease",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "1px solid var(--off-black)",
              opacity: 1,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              opacity: 0.75,
              border: "1px solid var(--off-black) !important",
            },
          },
          notchedOutline: {
            opacity: 0.5,
            border: "1px solid var(--off-black)",
          },
          input: {
            color: "var(--off-black)",
            "&:-webkit-autofill": {
              boxShadow: "0 0 0 100px transparent inset !important",
              WebkitTextFillColor: "var(--off-black) !important",
              transition: "background-color 5000s ease-in-out 0s",
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            transition: "all 0.2s ease",
            color: "var(--off-black)",
            opacity: 0.5,
            fontSize: isMobile ? "0.8rem" : isTablet ? "0.9rem" : "1rem",
            "&.Mui-focused": {
              color: "var(--off-black)",
              opacity: 0.8,
            },
          },
        },
      },
    },
  });

export default createCustomTheme;
