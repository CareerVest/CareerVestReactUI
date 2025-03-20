"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

interface InactivityPopupProps {
  open: boolean;
  timeLeft: number;
  onExtend: () => void;
  onLogout: () => void;
}

export default function InactivityPopup({
  open,
  timeLeft,
  onExtend,
  onLogout,
}: InactivityPopupProps) {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth className="inactivity-popup">
      <DialogTitle>Inactive Session</DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body1">
            You’ve been inactive for 30 minutes. Your session will end in{" "}
            <strong>{timeLeft} seconds</strong> unless you extend it.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button variant="contained" color="primary" onClick={onExtend}>
          Extend Session
        </Button>
        <Button variant="outlined" color="secondary" onClick={onLogout}>
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
}
