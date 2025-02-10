import type React from "react"
import { Paper, Typography } from "@mui/material"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { Client } from "../types"

interface ClientDemographicsProps {
  clients: Client[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const ClientDemographics: React.FC<ClientDemographicsProps> = ({ clients }) => {
  const techStackData = clients.reduce(
    (acc, client) => {
      acc[client.techStack] = (acc[client.techStack] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const data = Object.entries(techStackData).map(([name, value]) => ({ name, value }))

  return (
    <Paper elevation={3} sx={{ p: 2, height: 300 }}>
      <Typography variant="h6" gutterBottom>
        Client Demographics
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  )
}

export default ClientDemographics

