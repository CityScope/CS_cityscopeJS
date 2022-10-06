import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Collapse,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";

import { useState } from "react";

export default function CollapsableCard({
  children,
  variant,
  title,
  subheader,
}) {
  const [expand, setExpand] = useState(true);

  return (
    <>
      <Paper>
        <Card variant={variant ? variant : "outlined"}>
          <CardContent>
            <CardHeader
              title={title ? title : ""}
              subheader={subheader ? subheader : ""}
            />
            <Divider variant="middle" />
            <CardActions>
              <IconButton onClick={() => setExpand(!expand)}>
                <ArrowDropDown />
              </IconButton>
            </CardActions>
            <Collapse in={expand}>{children}</Collapse>
          </CardContent>
        </Card>
      </Paper>
    </>
  );
}
