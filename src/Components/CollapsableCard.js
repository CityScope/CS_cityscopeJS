import {
  Card,
  CardContent,
  Collapse,
  Button,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { useState } from "react";

export default function CollapsableCard({
  children,
  variant,
  title,
  subheader,
  collapse,
}) {
  const [expand, setExpand] = useState(collapse);

  return (
    <div>
      <Divider sx={{ mt: 1 }} />
      <Button
        fullWidth
        onClick={() => setExpand(!expand)}
        sx={{ justifyContent: "flex-start" }}
      >
        <ArrowDropDown />
        <div style={{ display: "block", textAlign: "left" }}>
          <Typography>{title ? title : ""}</Typography>
          <Typography color={"secondary.main"} variant="caption">
            {subheader ? subheader : ""}
          </Typography>
        </div>
      </Button>
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
