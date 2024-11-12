import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const headerStyle = {
  p: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export default function CustomModal({
  title,
  btnName = '',
  children,
}: {
  title: string;
  btnName?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        onClick={handleOpen}
        sx={{ my: 2, color: "white", display: "block" }}
      >
        {!btnName ? title : btnName}
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Box sx={headerStyle}>
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
            <Box>{children}</Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
