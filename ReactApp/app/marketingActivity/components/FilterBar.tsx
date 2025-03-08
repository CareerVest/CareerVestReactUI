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
  Collapse,
  SelectChangeEvent,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  Add as AddIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import type {
  FilterState,
  MarketingRecruiter,
} from "@/app/types/MarketingActivity/Marketing";

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  standupMode: boolean;
  onStandupModeChange: (enabled: boolean) => void;
  recruiters: MarketingRecruiter[] | undefined | null;
  onAddInterview?: () => void; // Made optional
  onOpenApplicationCounts?: () => void; // Made optional
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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(
    filters.searchQuery || ""
  );
  const [sortedRecruiters, setSortedRecruiters] = useState<
    MarketingRecruiter[]
  >([]);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<FilterState>) => {
      onFiltersChange({ ...filters, ...newFilters });
    },
    [filters, onFiltersChange]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(filters.searchQuery || "");
      if (!filters.searchQuery && filters.quickFilters.length === 0) {
        handleFiltersChange({ searchQuery: "", quickFilters: [] });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.searchQuery, filters.quickFilters, handleFiltersChange]);

  // Sort recruiters in ascending order by name
  useEffect(() => {
    if (recruiters && recruiters.length > 0) {
      const sorted = [...recruiters].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setSortedRecruiters(sorted);

      // Set the first recruiter as default if no recruiter is selected
      if (!filters.recruiter && sorted.length > 0) {
        handleFiltersChange({ recruiter: sorted[0].id });
      }
    } else {
      setSortedRecruiters([]);
    }
  }, [recruiters, filters.recruiter, handleFiltersChange]);

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

      {/* Recruiter List (Scrollable List Box with Ascending Order) */}
      <Box
        sx={{
          maxHeight: "calc(100vh - 400px)",
          overflowY: "auto",
          borderRadius: 2,
          border: "1px solid rgba(104, 42, 83, 0.1)",
        }}
      >
        <List dense>
          {sortedRecruiters.map((recruiter, index) => (
            <ListItemButton
              key={`recruiter-${recruiter.id || `index-${index}`}`}
              selected={filters.recruiter === recruiter.id}
              onClick={() =>
                handleRecruiterChange(recruiter.id || `index-${index}`)
              }
              sx={{ borderRadius: index === 0 ? "4px 4px 0 0" : 0 }}
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
              borderRadius: 2,
              border: "1px solid rgba(104, 42, 83, 0.1)",
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
              borderRadius: 2,
              border: "1px solid rgba(104, 42, 83, 0.1)",
            }}
          />
        </Box>
      </Collapse>

      {/* Status Select (Collapsed in Standup Mode) */}
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
                  maxHeight: 200,
                  maxWidth: 200,
                  borderRadius: 2,
                },
              },
              autoFocus: true,
            }}
            sx={{
              borderRadius: 2,
              border: "1px solid rgba(104, 42, 83, 0.1)",
              "& .MuiSelect-select": { padding: "8px 14px" },
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="scheduled">Scheduled</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Collapse>

      {/* Type Select (Collapsed in Standup Mode) */}
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
                  maxHeight: 200,
                  maxWidth: 200,
                  borderRadius: 2,
                },
              },
              autoFocus: true,
            }}
            sx={{
              borderRadius: 2,
              border: "1px solid rgba(104, 42, 83, 0.1)",
              "& .MuiSelect-select": { padding: "8px 14px" },
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
              recruiter: sortedRecruiters[0]?.id || "",
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

      {/* Action Buttons (Commented Out) */}
      {/* <Button
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
      </Button> */}
    </Box>
  );
}
