import {
  Card,
  CardContent,
  Collapse,
  Button,
  Paper,
  Typography,
  Divider,
  Tooltip,
  Grid,
} from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { useState } from "react";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";

export default function CollapsableCard({
  children,
  variant,
  title,
  subheader,
  collapse,
  toolTipInfo,
}) {
  const [expand, setExpand] = useState(collapse);

  return (
    <div>
      <Divider sx={{ mt: 1 }} />
      <Grid container justifyContent="center">
        <Button
          fullWidth
          onClick={() => setExpand(!expand)}
          sx={{ justifyContent: "flex-start" }}
        >
          <Grid item container xs={10} direction="row">
            <ArrowDropDown />
            <div style={{ display: "block", textAlign: "left" }}>
              <Typography>{title ? title : ""}</Typography>
              <Typography color={"secondary.main"} variant="caption">
                {subheader ? subheader : ""}
              </Typography>
            </div>
          </Grid>
          <Grid item container xs={2} alignItems="end" direction="column">
            {toolTipInfo && (
              <Tooltip
                placement="top"
                title={<Typography>{toolTipInfo}</Typography>}
              >
                <HelpCenterIcon />
              </Tooltip>
            )}
          </Grid>
        </Button>
      </Grid>
      <Paper>
        <Collapse in={expand}>
          <Card variant={variant ? variant : "outlined"} sx={{ width: "100%" }}>
            <CardContent>{children}</CardContent>
          </Card>
        </Collapse>
      </Paper>
    </div>
  );
}
