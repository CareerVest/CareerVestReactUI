"use client"

import { Button } from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"
import { useRouter } from "next/navigation"

export default function AddClientButton() {
  const router = useRouter()

  const handleAddClient = () => {
    router.push("/clients/new")
  }

  return (
    <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleAddClient}>
      Add New Client
    </Button>
  )
}

