import { useSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useEffect, useRef } from "react";
import { setUseSnackbarRef } from "../alert";

const SnackbarUtilsConfigurator = () => {
  const snackbar = useSnackbar();
  const hasConfigured = useRef(false);

  useEffect(() => {
    if (hasConfigured.current) return;

    // Store original method before overriding
    const originalEnqueue = snackbar.enqueueSnackbar.bind(snackbar);

    snackbar.enqueueSnackbar = (msg, options = {}) => {
      const key = options.key || new Date().getTime() + Math.random();
      const action = (
        <IconButton size="small" onClick={() => snackbar.closeSnackbar(key)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      );
      return originalEnqueue(msg, { ...options, key, action });
    };

    setUseSnackbarRef(snackbar);
    hasConfigured.current = true;
  }, [snackbar]);

  return null;
};

export default SnackbarUtilsConfigurator;
