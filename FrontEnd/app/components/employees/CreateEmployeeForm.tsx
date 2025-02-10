"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Box, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, InputAdornment } from "@mui/material"
import { createEmployee } from "../../actions/employeeActions"
import type { EmployeeFormData } from "../../types/employee"

export default function CreateEmployeeForm() {
  const router = useRouter()
  const [employeeData, setEmployeeData] = useState<EmployeeFormData>({
    FirstName: "",
    LastName: "",
    PersonalEmailAddress: "",
    CompanyEmailAddress: null,
    Role: null,
    HireDate: null,
    TerminationDate: null,
    Status: "Active",
    Department: null,
    Position: null,
    Manager: null,
    Salary: null,
    PhoneNumber: null,
    Address: null,
    EmergencyContact: null,
    EmergencyContactPhone: null,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSelectChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof EmployeeFormData
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: event.target.value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      await createEmployee(employeeData)
      router.push("/employees")
      router.refresh()
    } catch (error) {
      console.error("Failed to create employee:", error)
      alert("Failed to create employee. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="FirstName"
            name="FirstName"
            label="First Name"
            value={employeeData.FirstName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="LastName"
            name="LastName"
            label="Last Name"
            value={employeeData.LastName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="PersonalEmailAddress"
            name="PersonalEmailAddress"
            label="Personal Email Address"
            type="email"
            value={employeeData.PersonalEmailAddress}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="CompanyEmailAddress"
            name="CompanyEmailAddress"
            label="Company Email Address"
            type="email"
            value={employeeData.CompanyEmailAddress || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="Role"
            name="Role"
            label="Role"
            value={employeeData.Role || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="HireDate"
            name="HireDate"
            label="Hire Date"
            type="date"
            value={employeeData.HireDate || ""}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="Status-label">Status</InputLabel>
            <Select
              labelId="Status-label"
              id="Status"
              name="Status"
              value={employeeData.Status}
              onChange={handleSelectChange}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="On Leave">On Leave</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="Department"
            name="Department"
            label="Department"
            value={employeeData.Department || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="Position"
            name="Position"
            label="Position"
            value={employeeData.Position || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="Manager"
            name="Manager"
            label="Manager"
            value={employeeData.Manager || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="Salary"
            name="Salary"
            label="Salary"
            type="number"
            value={employeeData.Salary || ""}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="PhoneNumber"
            name="PhoneNumber"
            label="Phone Number"
            value={employeeData.PhoneNumber || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="Address"
            name="Address"
            label="Address"
            value={employeeData.Address || ""}
            onChange={handleInputChange}
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="EmergencyContact"
            name="EmergencyContact"
            label="Emergency Contact"
            value={employeeData.EmergencyContact || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="EmergencyContactPhone"
            name="EmergencyContactPhone"
            label="Emergency Contact Phone"
            value={employeeData.EmergencyContactPhone || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button onClick={() => router.push("/employees")} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Employee"}
        </Button>
      </Box>
    </Box>
  )
}

