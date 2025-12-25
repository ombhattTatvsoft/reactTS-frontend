import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CommonModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  dailogHead?: React.ReactNode;
  children: React.ReactNode;
  width?: "xs" | "sm" | "md" | "lg" | "xl";
}

const CommonModal: React.FC<CommonModalProps> = ({
  open,
  onClose,
  title,
  dailogHead,
  children,
  width = "md",
}) => (
  <Dialog
    open={open}
    onClose={(_, reason) => {
      if (reason === "backdropClick" || reason === "escapeKeyDown") return;
      onClose();
    }}
    maxWidth={width}
    fullWidth
    sx={{
      "& .MuiPaper-root": {
        borderRadius: 3,
        border: "1px solid #ddd",
        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
      },
    }}
  >
    <DialogTitle sx={{ fontWeight: "bold" }}>
      {title}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    {dailogHead}
    <DialogContent dividers sx={{scrollbarWidth:'thin'}}>{children}</DialogContent>
  </Dialog>
);

export default CommonModal;
