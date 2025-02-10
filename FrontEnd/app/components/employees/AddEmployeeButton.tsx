"use client"

import { Button } from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"
import { useRouter } from "next/navigation"

export default function AddEmployeeButton() {
  const router = useRouter()

  const handleAddEmployee = () => {
    router.push("/employees/new")
  }

  return (
    <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleAddEmployee}>
      Add New Employee
    </Button>
  )
}

