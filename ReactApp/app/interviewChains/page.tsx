"use client";

import type React from "react";
import { useState } from "react";
import { Box, Typography, Container, Paper, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InterviewChainHub from "../interviewChains/components/interviewChainHub";
import {
  dummyInterviewChains,
  dummyInterviewChainStats,
} from "../interviewChains/dummyInterviewChainsData";
import type {
  Interview,
  InterviewChain,
} from "../types/interviewChain/interviewChain";
import EndInterviewDialog from "./components/endInterviewDialog";
import { theme } from "@/styles/theme";

export default function InterviewChainPage() {
  const [chains, setChains] = useState<InterviewChain[]>(dummyInterviewChains);
  const [stats, setStats] = useState(dummyInterviewChainStats);
  const [openNewInterviewDialog, setOpenNewInterviewDialog] = useState(false);
  const [selectedChain, setSelectedChain] = useState<InterviewChain | null>(
    null
  );

  // Handle end interview
  const handleEndInterview = (
    chainId: string,
    outcome: "Next" | "Rejected" | "Offer",
    newInterview?: Partial<Interview>
  ) => {
    setChains((prevChains) =>
      prevChains.map((chain) => {
        if (chain.id === chainId) {
          const updatedInterviews = [...chain.interviews];
          const latestInterviewIndex = updatedInterviews.length - 1;
          updatedInterviews[latestInterviewIndex] = {
            ...updatedInterviews[latestInterviewIndex],
            status: "Completed",
            outcome,
          };

          if (outcome === "Next" && newInterview) {
            updatedInterviews.push({
              id: `interview-${Math.random().toString(36).substring(2, 9)}`,
              type: newInterview.type || "Follow-up",
              date: newInterview.date || new Date().toISOString(),
              status: "Scheduled",
              notes: newInterview.notes,
              location: newInterview.location,
              interviewer: newInterview.interviewer,
            });
          }

          let newStatus = chain.status;
          if (outcome === "Rejected") newStatus = "Unsuccessful";
          else if (outcome === "Offer") newStatus = "Successful";

          return {
            ...chain,
            interviews: updatedInterviews,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return chain;
      })
    );

    setStats((prevStats) => {
      const activeChange = outcome !== "Next" ? -1 : 0;
      const successfulChange = outcome === "Offer" ? 1 : 0;
      const unsuccessfulChange = outcome === "Rejected" ? 1 : 0;

      return {
        ...prevStats,
        activeChains: prevStats.activeChains + activeChange,
        successfulChains: prevStats.successfulChains + successfulChange,
        unsuccessfulChains: prevStats.unsuccessfulChains + unsuccessfulChange,
        statusBreakdown: [
          { status: "Active", count: prevStats.activeChains + activeChange },
          {
            status: "Successful",
            count: prevStats.successfulChains + successfulChange,
          },
          {
            status: "Unsuccessful",
            count: prevStats.unsuccessfulChains + unsuccessfulChange,
          },
        ],
      };
    });
  };

  // Handle adding a new interview (new chain)
  const handleAddNewInterview = (
    newInterview: Partial<Interview> & {
      clientName?: string;
      position?: string;
    }
  ) => {
    const newChainId = `chain-${Math.random().toString(36).substring(2, 9)}`;
    const newInterviewWithId: Interview = {
      id: `interview-${Math.random().toString(36).substring(2, 9)}`,
      type: newInterview.type || "Initial",
      date: newInterview.date || new Date().toISOString(),
      status: "Scheduled",
      notes: newInterview.notes,
      location: newInterview.location,
      interviewer: newInterview.interviewer,
    };

    const newChain: InterviewChain = {
      id: newChainId,
      clientName: newInterview.clientName || "",
      position: newInterview.position || "",
      status: "Active",
      interviews: [newInterviewWithId],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      rounds: 1,
      latestInterview: newInterviewWithId,
    };

    setChains((prevChains) => [...prevChains, newChain]);
    setStats((prevStats) => ({
      ...prevStats,
      totalChains: prevStats.totalChains + 1,
      activeChains: prevStats.activeChains + 1,
      statusBreakdown: [
        { status: "Active", count: prevStats.activeChains + 1 },
        { status: "Successful", count: prevStats.successfulChains },
        { status: "Unsuccessful", count: prevStats.unsuccessfulChains },
      ],
    }));
    setOpenNewInterviewDialog(false);
  };

  // Handle adding a new interview to an existing chain
  const handleAddNewInterviewToChain = (
    chain: InterviewChain,
    newInterview: Partial<Interview>
  ) => {
    setChains((prevChains) =>
      prevChains.map((c) => {
        if (c.id === chain.id) {
          const newInterviewWithId: Interview = {
            id: `interview-${Math.random().toString(36).substring(2, 9)}`,
            type: newInterview.type || "Follow-up",
            date: newInterview.date || new Date().toISOString(),
            status: "Scheduled",
            notes: newInterview.notes,
            location: newInterview.location,
            interviewer: newInterview.interviewer,
          };

          return {
            ...c,
            interviews: [...c.interviews, newInterviewWithId],
            rounds: c.rounds + 1,
            latestInterview: newInterviewWithId,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  // Handle all interview-related actions (end or add)
  const handleInterviewAction = (
    chainId: string,
    outcome: "Next" | "Rejected" | "Offer" | "AddNew",
    newInterview?: Partial<Interview> & {
      clientName?: string;
      position?: string;
    }
  ) => {
    if (outcome === "AddNew" && newInterview) {
      if (chainId) {
        const chain = chains.find((c) => c.id === chainId);
        if (chain) {
          handleAddNewInterviewToChain(chain, newInterview);
        }
      } else {
        handleAddNewInterview(newInterview);
      }
    } else {
      handleEndInterview(
        chainId,
        outcome as "Next" | "Rejected" | "Offer",
        newInterview
      );
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4, position: "relative" }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: "#682A53" }}
          gutterBottom
        >
          Interview Chain
        </Typography>

        <Paper elevation={0} sx={{ p: 0 }}>
          <InterviewChainHub
            chains={chains}
            onEndInterview={handleInterviewAction}
            onAddNewInterview={handleAddNewInterviewToChain}
          />
        </Paper>

        {/* Custom Button with Static Content */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenNewInterviewDialog(true)}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
            minWidth: 56,
            width: 56,
            height: 56,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.palette.primary.main,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <AddIcon></AddIcon>
            {/* <Typography
              variant="button"
              sx={{ whiteSpace: "nowrap", marginLeft: 4, fontSize: "0.875rem" }}
            >
              +
            </Typography> */}
          </Box>
        </Button>

        <EndInterviewDialog
          open={openNewInterviewDialog}
          onClose={() => setOpenNewInterviewDialog(false)}
          chain={
            selectedChain || {
              id: "",
              clientName: "",
              position: "",
              status: "Active",
              interviews: [],
              updatedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              rounds: 0,
              latestInterview: {
                id: "",
                type: "",
                date: "",
                status: "Scheduled",
              },
            }
          }
          onSubmit={(outcome, newInterview) => {
            if (outcome === "Next" && newInterview && !selectedChain) {
              handleAddNewInterview(newInterview);
            } else if (outcome === "AddNew" && newInterview) {
              handleAddNewInterview(newInterview);
            } else if (newInterview && selectedChain) {
              handleInterviewAction(selectedChain.id, outcome, newInterview);
            }
          }}
        />
      </Box>
    </Container>
  );
}
