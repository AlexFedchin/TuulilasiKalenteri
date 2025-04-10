import { useMediaQuery } from "@mui/material";

const useScreenSize = () => {
  const isTablet = useMediaQuery("(max-width: 1023px)");
  const isMobile = useMediaQuery("(max-width: 599px)");

  return { isMobile, isTablet };
};

export default useScreenSize;
