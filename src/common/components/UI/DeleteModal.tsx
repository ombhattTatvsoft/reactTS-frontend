import React from "react";
import { Box, Button, Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CommonModal from "./Modal";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  isLoading = false,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  return (
    <CommonModal open={open} onClose={onClose} title={title} width="sm">
      <Box sx={{ py: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <WarningAmberIcon sx={{ fontSize: 60, color: "error.main" }} />
        </Box>

        <Typography variant="body1" sx={{ mb: 2, textAlign: "center" }}>
          {description}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isLoading}
            sx={{ minWidth: 100 }}
          >
            {cancelText}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onConfirm}
            disabled={isLoading}
            sx={{ minWidth: 100 }}
          >
            {isLoading ? "Deleting..." : confirmText}
          </Button>
        </Box>
      </Box>
    </CommonModal>
  );
};

export default DeleteModal;