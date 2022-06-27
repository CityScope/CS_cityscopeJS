import CityIOlist from "./CityIOlist";
import WelcomePage from "./WelcomePage";
import Box from '@mui/material/Box';


export default function CityIOviewer() {
  return (
    <>
      <CityIOlist />
      <Box
        style={{
          position: "relative",
          width: "50%",
          top: "50px",
          left: "50px",
        }}
      >
        <WelcomePage />
      </Box>
    </>
  );
}
