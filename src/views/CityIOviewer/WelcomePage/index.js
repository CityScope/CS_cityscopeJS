import { Typography, Link } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function WelcomePage() {
  return (
    <>
      <Typography variant="h1">MIT CityScope</Typography>
      <Typography variant="h4">
        MIT CityScope is an open-source urban modeling and simulation platform.
        CityScope allows users to examine different design alternatives, and
        observe their impact through multiple layers of urban analytics.
      </Typography>

      <Typography  variant="h4">
        <Link href={"https://github.com/CityScope"} target={"blank"}>
          <GitHubIcon fontSize={"small"} /> Join the CityScope open-source
          development
        </Link>
      </Typography>
    </>
  );
}
