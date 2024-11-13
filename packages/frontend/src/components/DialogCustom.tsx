import * as React from "react";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { Dialog, DialogContent, Divider } from "@mui/material";

export default function DialogCustom({
  title,
  open = false,
  handleClose,
  children,
}: {
  title: string;
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <Fade in={open}>
          <Box
            sx={{
              width: { xs: "100%", md: 375 },
              backgroundColor: "background.paper",
              boxShadow: 24,
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h5">{title}</Typography>
              <IconButton
                aria-label="close"
                size="medium"
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider />
            <DialogContent dividers={false} sx={{ px: 2.5, py: 1.5 }}>
              {children}
            </DialogContent>
          </Box>
        </Fade>
      </Dialog>
    </div>
  );
}
