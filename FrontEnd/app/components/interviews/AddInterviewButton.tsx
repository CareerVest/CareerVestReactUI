"use client"

import { Button } from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"
import { useRouter } from "next/navigation"

export default function AddInterviewButton() {
  const router = useRouter()

  const handleAddInterview = () => {
    router.push("/interviews/new")
  }

  return (
    <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleAddInterview}>
      Create New Interview
    </Button>
  )
}

