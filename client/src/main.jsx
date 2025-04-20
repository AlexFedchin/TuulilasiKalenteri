import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./utils/i18n";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")).render(
  <I18nextProvider i18n={i18n}>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={3000}
      preventDuplicate
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </SnackbarProvider>
  </I18nextProvider>
);
