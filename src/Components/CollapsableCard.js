import {
  Card,
  CardContent,
  Collapse,
  Paper,
  Typography,
  Tooltip,
  Grid,
  IconButton
} from "@mui/material";
import MinimizeIcon from '@mui/icons-material/Minimize';
import { useState } from "react";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import CloseIcon from '@mui/icons-material/Close';
import { motion } from "framer-motion";

export default function CollapsableCard({
  children,
  variant,
  title,
  subheader,
  collapse,
  toolTipInfo,
  hiddenCardfunction
}) {
  const [expand, setExpand] = useState(collapse);

  return (
    <div>
            <Card variant="outlined"
            sx={{ justifyContent: "flex-start", width:'100%', backgroundColor: "black", 
             borderRadius: "6px 6px 0px 0px", padding: 1, '&:active':{cursor:'default'}
          }}
          >
          <Grid container justifyContent="center">
          <Grid item container xs={8} direction="row">
            <div style={{ display: "block", textAlign: "left" }}>
              <Typography
                variant="h6"
                style={{ color: "white", fontWeight: "bold", fontSize: "10px" }}
              >
                {title ? title : ""}
              </Typography>
              <Typography
                style={{ color: "gray",  fontSize: "10px" }}
              >
                {subheader ? subheader : ""}
              </Typography>
            </div>
          </Grid>
          <Grid item container xs={4} justifyContent="end" direction="row">
            {toolTipInfo && (
              <Tooltip xs={'auto'}
                title={<Typography>{toolTipInfo}</Typography>}
              >
                <HelpCenterIcon />
              </Tooltip>
            )}
            
            <IconButton onClick={() => setExpand(!expand)}><MinimizeIcon /></IconButton>
            <IconButton onClick={e => {e.stopPropagation(); hiddenCardfunction(booli=>!booli)}} ><CloseIcon/></IconButton>
          </Grid>
          </Grid>
        </Card>
      
      <motion.div onPointerDownCapture={e => e.stopPropagation()}  >
        <Paper>
          <Collapse in={expand}>
            <Card variant={variant ? variant : "outlined"} sx={{ width: "100%", borderRadius: "0px 0px 6px 6px" }}>
              <CardContent>{children}</CardContent>
            </Card>
          </Collapse>
        </Paper>
      </motion.div>

    </div>
  );
}
