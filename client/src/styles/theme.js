import { createTheme } from "@mui/material/styles";

const createCustomTheme = ({ isMobile, isTablet }) =>
  createTheme({
    palette: {
      primary: {
        main: "#2aa4eb",
        contrastText: "#fcfcfc",
        hover: "#2690ce",
      },
    },
    typography: {
      fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
      button: {
        fontSize: isTablet ? "0.75rem" : "0.875rem",
      },
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
          card: {
            fontSize: isMobile ? "0.7rem" : isTablet ? "0.75rem" : "0.8rem",
            lineHeight: 1.45,
            fontWeight: 400,
          },
          bookingBox: {
            fontSize: isMobile ? "0.6rem" : isTablet ? "0.65rem" : "0.7rem",
            lineHeight: 1.2,
            fontWeight: 500,
          },
          h1: {
            fontSize: isMobile ? "3rem" : isTablet ? "3.5rem" : "4rem",
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
          h4: {
            fontSize: isMobile ? "1rem" : isTablet ? "1.15rem" : "1.3rem",
            fontWeight: 500,
          },
          h5: {
            fontSize: isMobile ? "0.8rem" : isTablet ? "0.85rem" : "0.9rem",
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "var(--white)",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 0 16px rgba(0, 0, 0, 0.05)",
            textAlign: "left",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "4px",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "2px solid var(--primary)",
              opacity: 1,
            },
            "&:not(.Mui-focused):hover .MuiOutlinedInput-notchedOutline": {
              opacity: 0.5,
              border: "1px solid var(--off-black) !important",
            },
            "&.Mui-disabled": {
              pointerEvents: "none",
            },
          },
          input: {
            alignItems: "center",
            display: "flex",
            color: "var(--off-black)",
            gap: 8,
            "&:-webkit-autofill": {
              boxShadow: "0 0 0 100px transparent inset !important",
              WebkitTextFillColor: "var(--off-black) !important",
              transition: "background-color 5000s ease-in-out 0s",
            },
            "&.Mui-disabled": {
              color: "var(--off-black) !important",
              WebkitTextFillColor: "var(--off-black) !important",
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "2px solid var(--primary)",
              opacity: 1,
            },
            "&:not(.Mui-focused):hover .MuiOutlinedInput-notchedOutline": {
              opacity: 0.5,
              border: "1px solid var(--off-black) !important",
            },
          },
          icon: {
            color: "var(--off-black)",
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
              color: "var(--primary)",
              opacity: 0.8,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          text: {
            fontSize: isTablet ? "0.75rem" : "0.875rem",
            "&:hover": {
              backgroundColor: "var(--off-white)",
            },
          },
          submit: {
            borderRadius: "4px",
            backgroundColor: "var(--primary)",
            color: "var(--white)",
            fontSize: isTablet ? "0.75rem" : "0.875rem",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "var(--primary-onhover)",
            },
            "&.Mui-disabled": {
              backgroundColor: "var(--light-grey)",
              color: "var(--off-grey)",
              opacity: 0.6,
              cursor: "not-allowed",
            },
          },
          cancel: {
            borderRadius: "4px",
            backgroundColor: "transparent",
            border: "1px solid var(--error)",
            color: "var(--error)",
            fontSize: isTablet ? "0.75rem" : "0.875rem",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "var(--error-onhover)",
              border: "1px solid var(--error-onhover)",
              color: "var(--white)",
            },
            "&.Mui-disabled": {
              backgroundColor: "transparent",
              color: "var(--off-grey)",
              border: "1px solid var(--off-grey)",
              opacity: 0.6,
              cursor: "not-allowed",
            },
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontSize: isMobile ? "0.75rem" : isTablet ? "0.875rem" : "1rem",
            fontWeight: 400,
          },
          secondary: {
            fontSize: isMobile ? "0.65rem" : isTablet ? "0.75rem" : "0.875rem",
            fontWeight: 300,
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: isMobile ? "25px" : isTablet ? "30px" : "35px",
            fontSize: isMobile ? "0.875rem" : isTablet ? "1rem" : "1.25rem",
          },
        },
      },
    },
  });

export default createCustomTheme;
