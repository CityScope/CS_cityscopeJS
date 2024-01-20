import { motion } from "framer-motion";
import { Resizable } from 're-resizable';
import CollapsableCard from "./CollapsableCard";

export default function ResizableDragable({
    isVisible,
    dragConstraints,
    size = {width: 320},
    collapsableCardTitle,
    collapsableCardSubheader,
    toolTipInfo,
    setHideCard,
    child
  }) {

    const variants = {
        closed: { opacity: 1, scale: 0 },
        open: {
          opacity: 1,
          scale: 1,
          transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2
          }
        }
    }

    return (
        <motion.div initial="hidden" animate={isVisible ? "open" : "closed"} variants={variants}
         drag dragConstraints={dragConstraints} dragMomentum={false} 
         style={{width:320, height: 60, x: "5%"}}>
            <Resizable defaultSize={size}
                style={{pointerEvents:"all", position: "absolute"}} minWidth={320} minHeight={60} 
                  // This checks that we're clicking the empty div that Resizable component uses
                  // avoids dragging the whole window when resizing
                  onPointerDownCapture={e =>  {if(e.target.innerHTML === ''){
                    e.stopPropagation()
                  } }}>
                <CollapsableCard
                    collapse={true}
                    variant="outlined"
                    title={collapsableCardTitle}
                    subheader={collapsableCardSubheader}
                    toolTipInfo={toolTipInfo}
                    hiddenCardfunction={setHideCard}
                    children={child}>
                </CollapsableCard>
            </Resizable>
        </motion.div>
    );

    
}       
  