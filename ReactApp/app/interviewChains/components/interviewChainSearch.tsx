"use client";

import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { Paper } from "@mui/material";

interface InterviewChainSearchProps {
  searchText: string;
  setSearchText: (text: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  totalChains: number;
}

export default function InterviewChainSearch({
  searchText,
  setSearchText,
  statusFilter,
  setStatusFilter,
  totalChains,
}: InterviewChainSearchProps) {
  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3, border: "2px solid rgba(104, 42, 83, 0.2)" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            placeholder="Search by end client name, client name, recruiter name, position, status, type, etc..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1, width: { xs: "100%", sm: "auto" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <FormControl
            size="small"
            sx={{ minWidth: 120, width: { xs: "100%", sm: "auto" } }}
          >
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Successful">Successful</MenuItem>
              <MenuItem value="Unsuccessful">Unsuccessful</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {totalChains} interview chains
          {statusFilter !== "All" && ` with status "${statusFilter}"`}
          {searchText && ` matching "${searchText}"`}
        </Typography>
      </Box>
    </Box>
  );
}
