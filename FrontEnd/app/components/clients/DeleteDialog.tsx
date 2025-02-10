import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material"
import type { Client } from "@/app/types/client"

interface DeleteDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  client: Client | null
}

export function DeleteDialog({ open, onClose, onConfirm, client }: DeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Client</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete {client?.name}? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

