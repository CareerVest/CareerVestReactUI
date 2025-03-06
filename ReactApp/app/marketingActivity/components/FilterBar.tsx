"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  CircularProgress,
  SelectChangeEvent,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  Add as AddIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import type { FilterState } from "@/app/types/MarketingActivity/Marketing";
import type { MarketingRecruiter } from "@/app/types/MarketingActivity/Marketing";

// Helper function to shuffle array using Fisher-Yates algorithm
const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper function to create a pseudo-random seed from a date
const createSeedFromDate = (date: string) => {
  return date.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

// Helper function to build query string
const buildQueryString = (filters: FilterState): string => {
  const parts: string[] = [];
  if (filters.recruiter && filters.recruiter !== "all") {
    parts.push(`client:${filters.recruiter}`);
  }
  if (filters.status && filters.status !== "all") {
    parts.push(`status:${filters.status}`);
  }
  if (filters.type && filters.type !== "all") {
    parts.push(`type:${filters.type}`);
  }
  if (filters.dateRange[0] && filters.dateRange[1]) {
    const startDate = new Date(filters.dateRange[0])
      .toISOString()
      .split("T")[0];
    const endDate = new Date(filters.dateRange[1]).toISOString().split("T")[0];
    if (startDate === endDate) {
      parts.push(startDate);
    } else {
      parts.push(`${startDate} to ${endDate}`);
    }
  }
  if (filters.searchQuery) {
    parts.push(filters.searchQuery);
  }
  return parts.length > 0 ? parts.join(" ") : "all";
};

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  standupMode: boolean;
  onStandupModeChange: (enabled: boolean) => void;
  recruiters: MarketingRecruiter[] | undefined | null;
  onAddInterview: () => void;
  onOpenApplicationCounts: () => void;
}

export function FilterBar({
  filters,
  onFiltersChange,
  standupMode,
  onStandupModeChange,
  recruiters,
  onAddInterview,
  onOpenApplicationCounts,
}: FilterBarProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(
    filters.searchQuery || ""
  );
  const [shuffledRecruiters, setShuffledRecruiters] = useState<
    MarketingRecruiter[] | null
  >(null); // State for shuffled recruiters

  const handleFiltersChange = useCallback(
    (newFilters: Partial<FilterState>) => {
      onFiltersChange({ ...filters, ...newFilters });
    },
    [filters, onFiltersChange]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(filters.searchQuery || "");
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!debouncedSearchQuery.trim() && filters.quickFilters.length === 0) {
        handleFiltersChange({
          searchQuery: "",
          quickFilters: [],
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [debouncedSearchQuery, filters.quickFilters, handleFiltersChange]);

  // Shuffle recruiters daily based on the current date
  useEffect(() => {
    if (recruiters && recruiters.length > 0) {
      // Use the current date to create a seed for consistent daily shuffling
      const today = new Date().toDateString();
      const seed = createSeedFromDate(today);

      // Set a pseudo-random seed for Math.random
      const originalRandom = Math.random;
      Math.random = () => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };

      // Shuffle the recruiters array
      const shuffled = shuffleArray(recruiters);
      setShuffledRecruiters(shuffled);

      // Restore the original Math.random
      Math.random = originalRandom;
    }
  }, [recruiters]); // Only run when recruiters change

  const handleRecruiterChange = (recruiterId: string) => {
    handleFiltersChange({ recruiter: recruiterId });
  };

  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value as
      | "all"
      | "scheduled"
      | "completed"
      | "cancelled";
    handleFiltersChange({ status: value });
  };

  const handleTypeChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value as
      | "all"
      | "Screening"
      | "Technical"
      | "Final Round";
    handleFiltersChange({ type: value });
  };

  const handleStartDateChange = (date: string | null) => {
    const startDate = date ? new Date(date) : null;
    handleFiltersChange({
      dateRange: [startDate, filters.dateRange[1]],
    });
  };

  const handleEndDateChange = (date: string | null) => {
    const endDate = date ? new Date(date) : null;
    handleFiltersChange({
      dateRange: [filters.dateRange[0], endDate],
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Box sx={{ p: 4, color: "red", bgcolor: "white" }}>{error}</Box>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Standup Mode Toggle */}
      <FormControlLabel
        control={
          <Switch
            checked={standupMode}
            onChange={(e) => onStandupModeChange(e.target.checked)}
            color="primary"
          />
        }
        label="Standup Mode"
        sx={{ color: "#682A53" }}
      />

      {/* Recruiter List (Scrollable List Box with Truly Unique Keys) */}
      <Box
        sx={{
          maxHeight: "calc(100vh - 400px)",
          overflowY: "auto",
          borderRadius: 2,
          border: "1px solid rgba(104, 42, 83, 0.1)",
        }}
      >
        <List dense>
          <ListItemButton
            key="all-recruiters" // Unique key for "All Recruiters"
            selected={filters.recruiter === "all"}
            onClick={() => handleRecruiterChange("all")}
            sx={{
              borderRadius: "4px 4px 0 0", // Rounded top corners for the first item
            }}
          >
            <ListItemText primary="All Recruiters" />
          </ListItemButton>
          {(shuffledRecruiters || []).map((recruiter, index) => (
            <ListItemButton
              key={`recruiter-${recruiter.id || `index-${index}`}`} // Use id or fallback to index for uniqueness
              selected={filters.recruiter === recruiter.id}
              onClick={() =>
                handleRecruiterChange(recruiter.id || `index-${index}`)
              }
              sx={{
                borderRadius: 0, // No additional rounding for middle items
              }}
            >
              <ListItemText
                primary={
                  recruiter.name || `Recruiter #${recruiter.id || index}`
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Start and End Date Fields (Collapsed in Standup Mode) */}
      <Collapse in={!standupMode}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <TextField
            label="Start Date"
            type="date"
            value={
              filters.dateRange[0]
                ? filters.dateRange[0].toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => handleStartDateChange(e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              borderRadius: 2, // Rounded corners to match Kanban cards
              border: "1px solid rgba(104, 42, 83, 0.1)", // Subtle border to match cards
            }}
          />
          <TextField
            label="End Date"
            type="date"
            value={
              filters.dateRange[1]
                ? filters.dateRange[1].toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => handleEndDateChange(e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              borderRadius: 2, // Rounded corners to match Kanban cards
              border: "1px solid rgba(104, 42, 83, 0.1)", // Subtle border to match cards
            }}
          />
        </Box>
      </Collapse>

      {/* Status Select (Searchable Dropdown) */}
      <Collapse in={!standupMode}>
        <FormControl fullWidth size="small">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status-select"
            value={filters.status || "all"}
            label="Status"
            onChange={handleStatusChange}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200, // Scrollable height
                  maxWidth: 200,
                  borderRadius: 2, // Rounded corners for the dropdown menu
                },
              },
              autoFocus: true, // Enables type-ahead searching
            }}
            sx={{
              borderRadius: 2, // Rounded corners for the Select component
              border: "1px solid rgba(104, 42, 83, 0.1)", // Subtle border to match cards
              "& .MuiSelect-select": {
                padding: "8px 14px", // Adjust padding for consistency
              },
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="scheduled">Scheduled</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Collapse>

      {/* Type Select (Searchable Dropdown) */}
      <Collapse in={!standupMode}>
        <FormControl fullWidth size="small">
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            labelId="type-label"
            id="type-select"
            value={filters.type || "all"}
            label="Type"
            onChange={handleTypeChange}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200, // Scrollable height
                  maxWidth: 200,
                  borderRadius: 2, // Rounded corners for the dropdown menu
                },
              },
              autoFocus: true, // Enables type-ahead searching
            }}
            sx={{
              borderRadius: 2, // Rounded corners for the Select component
              border: "1px solid rgba(104, 42, 83, 0.1)", // Subtle border to match cards
              "& .MuiSelect-select": {
                padding: "8px 14px", // Adjust padding for consistency
              },
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Screening">Screening</MenuItem>
            <MenuItem value="Technical">Technical</MenuItem>
            <MenuItem value="Final Round">Final Round</MenuItem>
          </Select>
        </FormControl>
      </Collapse>

      {/* Clear Filters (Visible Only in Non-Standup Mode) */}
      <Collapse in={!standupMode}>
        <Button
          variant="outlined"
          onClick={() =>
            handleFiltersChange({
              recruiter: "all",
              dateRange: [null, null],
              status: "all",
              type: "all",
              searchQuery: "",
              quickFilters: [],
            })
          }
          sx={{
            borderColor: "rgba(104, 42, 83, 0.2)",
            color: "#682A53",
            "&:hover": {
              bgcolor: "#682A53",
              color: "white",
              borderColor: "#682A53",
            },
          }}
        >
          Clear Filters
        </Button>
      </Collapse>

      {/* Action Buttons */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddInterview}
        sx={{
          bgcolor: "#FDC500",
          color: "#682A53",
          "&:hover": { bgcolor: "#682A53", color: "white" },
          mt: 1,
        }}
      >
        Add Interview
      </Button>
      <Button
        variant="contained"
        startIcon={<AssessmentIcon />}
        onClick={onOpenApplicationCounts}
        sx={{
          bgcolor: "#FDC500",
          color: "#682A53",
          "&:hover": { bgcolor: "#682A53", color: "white" },
          mt: 1,
        }}
      >
        Add Counts
      </Button>
    </Box>
  );
}
