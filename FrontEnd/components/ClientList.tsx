import type React from "react"
import { Paper, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@mui/material"
import { Info as InfoIcon } from "@mui/icons-material"
import type { Client } from "../types"

interface ClientListProps {
  clients: Client[]
  onClientSelect: (client: Client) => void
}

const ClientList: React.FC<ClientListProps> = ({ clients, onClientSelect }) => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Client List
      </Typography>
      <List>
        {clients.map((client) => (
          <ListItem key={client.id} divider>
            <ListItemText
              primary={client.name}
              secondary={`Status: ${client.status} | Last Activity: ${new Date(client.lastActivityDate).toLocaleDateString()}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="details" onClick={() => onClientSelect(client)}>
                <InfoIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default ClientList

