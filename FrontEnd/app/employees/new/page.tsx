import { Box, Typography, Button } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import EmployeeForm from "../../components/employees/EmployeeForm"
import Link from "next/link"

export const metadata = {
  title: "Add New Employee | CareerVest",
}

export default function NewEmployeePage() {
  return (
    <Box sx={{ p: 3 }}>
      <Button component={Link} href="/employees" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Employees
      </Button>
      <Typography variant="h4" component="h1" sx={{ mb: 3, color: "#682A53" }}>
        Add New Employee
      </Typography>
      <EmployeeForm />
    </Box>
  )
}

