import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

export default function TableListLoading() {
  const [progress, setProgress] = useState(0);

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: "100%", position: "fixed", bottom: "0px" }}>
      <BorderLinearProgress variant="determinate" value={progress} />
    </Box>
  );
}
