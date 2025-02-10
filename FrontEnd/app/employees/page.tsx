import { Box, Typography } from "@mui/material"
import EmployeeList from "../components/employees/EmployeeList"
import AddEmployeeButton from "../components/employees/AddEmployeeButton"

export const metadata = {
  title: "Employees | CareerVest",
}

export default function EmployeesPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: "#682A53" }}>
          Employees
        </Typography>
        <AddEmployeeButton />
      </Box>
      <EmployeeList />
    </Box>
  )
}

