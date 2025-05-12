import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./utils/i18n";
import SnackbarProviderWrapper from "./utils/snackbars/SnackbarProviderWrapper";
import useScreenSize from "./hooks/useScreenSize.js";

const Root = () => {
  const { isMobile, isTablet } = useScreenSize();

  return (
    <I18nextProvider i18n={i18n}>
      <SnackbarProviderWrapper isMobile={isMobile} isTablet={isTablet}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SnackbarProviderWrapper>
    </I18nextProvider>
  );
};

createRoot(document.getElementById("root")).render(<Root />);
