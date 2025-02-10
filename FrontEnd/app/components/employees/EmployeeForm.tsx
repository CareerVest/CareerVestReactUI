"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Box, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { createEmployee, updateEmployee, fetchEmployees } from "@/app/actions/employeeActions"
import type { Employee, EmployeeFormData } from "@/app/types/employee"

interface EmployeeFormProps {
  initialData?: Employee
  employeeId?: number
}

export default function EmployeeForm({ initialData, employeeId }: EmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeFormData>(
    initialData || {
      FirstName: "",
      LastName: "",
      PersonalEmailAddress: "",
      PersonalPhoneNumber: null,
      PersonalPhoneCountryCode: null,
      CompanyEmailAddress: null,
      JoinedDate: null,
      Status: null,
      TerminatedDate: null,
      EmployeeReferenceID: null,
      CompanyComments: null,
      Role: null,
      SupervisorID: null,
    },
  )
  const [supervisors, setSupervisors] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchSupervisors = async () => {
      const employees = await fetchEmployees()
      setSupervisors(employees)
    }
    fetchSupervisors()
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name as string]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      if (employeeId) {
        await updateEmployee(employeeId, formData)
      } else {
        await createEmployee(formData)
      }
      router.push("/employees")
      router.refresh()
    } catch (error) {
      console.error("Failed to save employee:", error)
      alert("Failed to save employee. Please try again.")
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
            value={formData.FirstName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="LastName"
            name="LastName"
            label="Last Name"
            value={formData.LastName}
            onChange={handleChange}
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
            value={formData.PersonalEmailAddress}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="CompanyEmailAddress"
            name="CompanyEmailAddress"
            label="Company Email Address"
            type="email"
            value={formData.CompanyEmailAddress || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="PersonalPhoneNumber"
            name="PersonalPhoneNumber"
            label="Personal Phone Number"
            value={formData.PersonalPhoneNumber || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="PersonalPhoneCountryCode"
            name="PersonalPhoneCountryCode"
            label="Phone Country Code"
            value={formData.PersonalPhoneCountryCode || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="JoinedDate"
            name="JoinedDate"
            label="Joined Date"
            type="date"
            value={formData.JoinedDate || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="Status"
              name="Status"
              value={formData.Status || ""}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Terminated">Terminated</MenuItem>
              <MenuItem value="On Leave">On Leave</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="TerminatedDate"
            name="TerminatedDate"
            label="Terminated Date"
            type="date"
            value={formData.TerminatedDate || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="EmployeeReferenceID"
            name="EmployeeReferenceID"
            label="Employee Reference ID"
            value={formData.EmployeeReferenceID || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="Role"
              name="Role"
              value={formData.Role || ""}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Recruiter">Recruiter</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="supervisor-label">Supervisor</InputLabel>
            <Select
              labelId="supervisor-label"
              id="SupervisorID"
              name="SupervisorID"
              value={formData.SupervisorID || ""}
              onChange={handleChange}
              label="Supervisor"
            >
              <MenuItem value="">None</MenuItem>
              {supervisors.map((supervisor) => (
                <MenuItem key={supervisor.EmployeeID} value={supervisor.EmployeeID}>
                  {`${supervisor.FirstName} ${supervisor.LastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="CompanyComments"
            name="CompanyComments"
            label="Company Comments"
            multiline
            rows={1}
            value={formData.CompanyComments || ""}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
        {isLoading ? "Saving..." : employeeId ? "Update Employee" : "Create Employee"}
      </Button>
    </Box>
  )
}

