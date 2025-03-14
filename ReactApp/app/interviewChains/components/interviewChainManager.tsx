"use client";

import { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import type {
  Interview,
  InterviewChain,
} from "@/app/types/interviewChain/interviewChain";
import AddInterviewDialog from "./addInterviewDialog";
import CreateInterviewChainForm from "./createInterviewChainForm";
import EditInterviewDialog from "./editInterviewDialog";
import EndInterviewDialog from "./endInterviewDialog";
import { useInterviewChains } from "./hooks/useInterviewChains";
import InterviewChainHub from "./interviewChainHub";
import ChainExploration from "./chainExploration";

interface InterviewChainManagerProps {
  openAddDialog: boolean;
  setOpenAddDialog: (open: boolean) => void;
}

export default function InterviewChainManager({
  openAddDialog: openAddDialogFromParent,
  setOpenAddDialog: setOpenAddDialogFromParent,
}: InterviewChainManagerProps) {
  const {
    chains,
    stats,
    loading,
    detailLoading,
    selectedChain,
    setSelectedChain,
    openChainExploration,
    setOpenChainExploration,
    fetchChains,
    addInterview,
    editInterview,
    endInterview,
    updateChainStatus,
    createNewChain,
  } = useInterviewChains();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openEndDialog, setOpenEndDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openAddInterviewDialog, setOpenAddInterviewDialog] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<
    Interview | undefined
  >(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEndInterview = (
    chain: InterviewChain,
    isEditing: boolean,
    interview?: Interview
  ) => {
    setSelectedChain(chain);
    setSelectedInterview(interview);
    setOpenEndDialog(true);
  };

  const handleAddNewInterview = (chain: InterviewChain) => {
    setSelectedChain(chain);
    setSelectedInterview(undefined);
    setOpenAddInterviewDialog(true);
  };

  const handleInterviewAction = async (
    interviewId: string,
    outcome: "Next" | "Rejected" | "Offer" | "AddNew" | "Edit",
    newInterview?: Partial<Interview> & {
      clientName?: string;
      position?: string;
      recruiterName?: string;
    }
  ) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (outcome === "AddNew" && newInterview) {
        if (interviewId === "new") {
          await createNewChain(newInterview); // Pass newInterview to createNewChain
          setOpenCreateDialog(false);
          setOpenAddDialogFromParent(false);
        } else {
          const targetId = selectedInterview?.InterviewChainID
            ? selectedInterview.InterviewChainID.toString()
            : interviewId;
          await addInterview(targetId, newInterview);
          setOpenAddInterviewDialog(false);
        }
      } else if (outcome === "Edit" && newInterview && selectedInterview) {
        await editInterview(interviewId, selectedInterview, newInterview);
        setOpenEditDialog(false);
      } else {
        const targetId = selectedInterview?.InterviewChainID
          ? selectedInterview.InterviewChainID.toString()
          : interviewId;
        if (
          outcome === "Rejected" ||
          outcome === "Next" ||
          outcome === "Offer"
        ) {
          await endInterview(targetId, outcome, newInterview);
          if (outcome === "Next") {
            setOpenEndDialog(false);
            setOpenAddInterviewDialog(true);
          } else {
            setOpenEndDialog(false);
          }
        }
      }

      if (outcome !== "Next") {
        setSelectedInterview(undefined);
      }
    } catch (error) {
      console.error("Error handling interview action:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <InterviewChainHub
          chains={chains}
          onEndInterview={handleEndInterview}
          onAddNewInterview={handleAddNewInterview}
          onViewChain={setSelectedChain}
          onCreateNewChain={() => setOpenCreateDialog(true)}
        />
      )}

      <CreateInterviewChainForm
        open={openCreateDialog}
        onClose={() => {
          setOpenCreateDialog(false);
          setOpenAddDialogFromParent(false);
        }}
        onSubmit={handleInterviewAction}
      />

      {selectedChain && (
        <AddInterviewDialog
          chain={selectedChain}
          open={openAddInterviewDialog}
          onClose={() => {
            setOpenAddInterviewDialog(false);
            setSelectedInterview(undefined);
          }}
          onSubmit={handleInterviewAction}
          selectedInterview={selectedInterview}
          isSubmitting={isSubmitting}
        />
      )}

      {selectedChain && selectedInterview && (
        <EditInterviewDialog
          chain={selectedChain}
          open={openEditDialog}
          onClose={() => {
            setOpenEditDialog(false);
            setSelectedInterview(undefined);
          }}
          onSubmit={handleInterviewAction}
          interviewToEdit={selectedInterview}
          isSubmitting={isSubmitting}
        />
      )}

      {selectedChain && (
        <EndInterviewDialog
          chain={selectedChain}
          open={openEndDialog}
          onClose={() => {
            setOpenEndDialog(false);
            setSelectedInterview(undefined);
          }}
          onSubmit={handleInterviewAction}
          onOpenAddInterview={() => {
            setOpenEndDialog(false);
            setOpenAddInterviewDialog(true);
          }}
          selectedInterview={selectedInterview}
          isSubmitting={isSubmitting}
        />
      )}

      {selectedChain && (
        <ChainExploration
          chain={selectedChain}
          open={openChainExploration}
          onClose={() => {
            setOpenChainExploration(false);
            setSelectedInterview(undefined);
          }}
          onEndInterview={handleEndInterview}
          onAddNewInterview={(chain) => handleAddNewInterview(chain)}
          onUpdateChainStatus={updateChainStatus}
          onEditInterview={(interview) => {
            setSelectedInterview(interview);
            setOpenEditDialog(true);
          }}
        />
      )}

      {detailLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
