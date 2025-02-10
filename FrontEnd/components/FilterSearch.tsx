"use client"

import type React from "react"
import { useState } from "react"
import { Paper, Typography, TextField, Button, Grid } from "@mui/material"

interface FilterSearchProps {
  onFilterChange: (filters: any) => void
  onSearch: (query: string) => void
}

const FilterSearch: React.FC<FilterSearchProps> = ({ onFilterChange, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filter & Search
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default FilterSearch

