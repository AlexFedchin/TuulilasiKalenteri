import React from "react";
import { Box, Card, Skeleton } from "@mui/material";
import useScreenSize from "../../hooks/useScreenSize";

const BookingCardSkeleton = () => {
  const { isMobile, isTablet } = useScreenSize();
  return (
    <Card
      sx={{
        bgcolor: "var(--white-onhover)",
        p: isMobile ? 1 : 2,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        gap: 1,
        width: "100%",
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={225}
        height={isMobile ? 20 : isTablet ? 23 : 25}
        sx={{
          borderRadius: 1,
        }}
      />

      <Skeleton
        variant="circular"
        animation="wave"
        width={isMobile ? 20 : isTablet ? 23 : 25}
        height={isMobile ? 20 : isTablet ? 23 : 25}
        sx={{
          position: "absolute",
          top: isMobile ? 8 : 16,
          right: isMobile ? 8 : 16,
        }}
      />
      {/* Grid Content */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(2, 1fr)"
        gap={isMobile ? 1 : 2}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={120}
          sx={{
            borderRadius: 1,
            flexGrow: 1,
          }}
        />
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={120}
          sx={{
            borderRadius: 1,
            flexGrow: 1,
          }}
        />
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={120}
          sx={{
            borderRadius: 1,
            flexGrow: 1,
          }}
        />
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={120}
          sx={{
            borderRadius: 1,
            flexGrow: 1,
          }}
        />
      </Box>
    </Card>
  );
};

export default BookingCardSkeleton;
