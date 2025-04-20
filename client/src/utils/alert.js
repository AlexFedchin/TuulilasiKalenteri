let useSnackbarRef;
export const setUseSnackbarRef = (useSnackbar) => {
  useSnackbarRef = useSnackbar;
};

export const alert = {
  success: (msg) => useSnackbarRef.enqueueSnackbar(msg, { variant: "success" }),
  error: (msg) => useSnackbarRef.enqueueSnackbar(msg, { variant: "error" }),
  warning: (msg) => useSnackbarRef.enqueueSnackbar(msg, { variant: "warning" }),
  info: (msg) => useSnackbarRef.enqueueSnackbar(msg, { variant: "info" }),
};
