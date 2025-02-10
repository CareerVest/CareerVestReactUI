"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Box, Button, TextField, MenuItem, Grid } from "@mui/material"
import {
  createClient,
  updateClient,
  getRecruiters,
  getSubscriptionPlans,
  getPostPlacementPlans,
} from "../../actions/clientActions"
import type { ClientFormData, Employee, SubscriptionPlan, PostPlacementPlan } from "../../types/client"

interface ClientFormProps {
  initialData?: ClientFormData
  clientId?: number
}

export default function ClientForm({ initialData, clientId }: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>(
    initialData || {
      ClientName: "",
      EnrollmentDate: null,
      TechStack: null,
      PersonalPhoneNumber: null,
      PersonalEmailAddress: null,
      AssignedRecruiterID: null,
      VisaStatus: null,
      LinkedInURL: null,
      ClientStatus: null,
      SubscriptionPlanID: null,
      PostPlacementPlanID: null,
    },
  )
  const [recruiters, setRecruiters] = useState<Employee[]>([])
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([])
  const [postPlacementPlans, setPostPlacementPlans] = useState<PostPlacementPlan[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [recruitersData, subscriptionPlansData, postPlacementPlansData] = await Promise.all([
          getRecruiters(),
          getSubscriptionPlans(),
          getPostPlacementPlans(),
        ])
        setRecruiters(recruitersData)
        setSubscriptionPlans(subscriptionPlansData)
        setPostPlacementPlans(postPlacementPlansData)
      } catch (error) {
        console.error("Failed to fetch form data:", error)
        alert("Failed to load form data. Please try again.")
      }
    }
    fetchFormData()
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      if (clientId) {
        await updateClient(clientId, formData)
      } else {
        await createClient(formData)
      }
      router.push("/clients")
      router.refresh()
    } catch (error) {
      console.error("Failed to save client:", error)
      alert("Failed to save client. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="ClientName"
            name="ClientName"
            label="Client Name"
            value={formData.ClientName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="EnrollmentDate"
            name="EnrollmentDate"
            label="Enrollment Date"
            type="date"
            value={formData.EnrollmentDate || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="TechStack"
            name="TechStack"
            label="Tech Stack"
            value={formData.TechStack || ""}
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
            id="PersonalEmailAddress"
            name="PersonalEmailAddress"
            label="Personal Email Address"
            type="email"
            value={formData.PersonalEmailAddress || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="AssignedRecruiterID"
            name="AssignedRecruiterID"
            label="Assigned Recruiter"
            select
            value={formData.AssignedRecruiterID || ""}
            onChange={handleChange}
          >
            {recruiters.map((recruiter) => (
              <MenuItem key={recruiter.EmployeeID} value={recruiter.EmployeeID}>
                {`${recruiter.FirstName} ${recruiter.LastName}`}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="VisaStatus"
            name="VisaStatus"
            label="Visa Status"
            value={formData.VisaStatus || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="LinkedInURL"
            name="LinkedInURL"
            label="LinkedIn URL"
            value={formData.LinkedInURL || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="ClientStatus"
            name="ClientStatus"
            label="Client Status"
            select
            value={formData.ClientStatus || ""}
            onChange={handleChange}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Placed">Placed</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="SubscriptionPlanID"
            name="SubscriptionPlanID"
            label="Subscription Plan"
            select
            value={formData.SubscriptionPlanID || ""}
            onChange={handleChange}
          >
            {subscriptionPlans.map((plan) => (
              <MenuItem key={plan.SubscriptionPlanID} value={plan.SubscriptionPlanID}>
                {plan.PlanName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="PostPlacementPlanID"
            name="PostPlacementPlanID"
            label="Post-Placement Plan"
            select
            value={formData.PostPlacementPlanID || ""}
            onChange={handleChange}
          >
            {postPlacementPlans.map((plan) => (
              <MenuItem key={plan.PostPlacementPlanID} value={plan.PostPlacementPlanID}>
                {plan.PlanName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
        {isLoading ? "Saving..." : clientId ? "Update Client" : "Create Client"}
      </Button>
    </Box>
  )
}

