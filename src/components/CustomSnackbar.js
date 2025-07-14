import React from "react";
import { Snackbar, Alert, Slide } from "@mui/material";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function CustomSnackbar({ open, onClose, message, severity = "info", duration = 3500 }) {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={duration}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={SlideTransition}
    >
      <Alert onClose={onClose} severity={severity} sx={{ borderRadius: 2, fontWeight: 500, fontSize: 18, boxShadow: 2 }}>
        {message}
      </Alert>
    </Snackbar>
  );
} 