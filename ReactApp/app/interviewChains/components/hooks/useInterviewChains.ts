"use client";

import { useState, useEffect } from "react";
import type {
  Interview,
  InterviewChain,
  InterviewChainStats,
  InterviewChainAdd,
  InterviewChainEnd,
  InterviewChainUpdate,
} from "@/app/types/interviewChain/interviewChain";
import {
  fetchInterviewChains,
  getInterviewChain,
  createInterviewChain,
  updateInterviewChain,
  addInterviewToChain,
  endInterviewChain,
} from "../../actions/interviewChainActions";

export const useInterviewChains = () => {
  const [chains, setChains] = useState<InterviewChain[]>([]);
  const [stats, setStats] = useState<InterviewChainStats>({
    totalChains: 0,
    activeChains: 0,
    successfulChains: 0,
    unsuccessfulChains: 0,
    statusBreakdown: [
      { status: "Active", count: 0 },
      { status: "Successful", count: 0 },
      { status: "Unsuccessful", count: 0 },
    ],
    monthlyActivity: [],
    averageRounds: 0,
    offerRate: 0,
    topClients: [],
  });
  const [selectedChain, setSelectedChain] = useState<InterviewChain | null>(null);
  const [openChainExploration, setOpenChainExploration] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchChains();
  }, []);

  const fetchChains = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const fetchedChains = await fetchInterviewChains();
      console.log("Fetched chains:", fetchedChains);
      setChains(fetchedChains);
      updateStats(fetchedChains);
    } catch (error) {
      console.error("Failed to load interview chains:", error);
      setFetchError("Failed to load interview chains");
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (chainsData: InterviewChain[]) => {
    const active = chainsData.filter((c) => c.status === "Active").length;
    const successful = chainsData.filter((c) => c.status === "Successful").length;
    const unsuccessful = chainsData.filter((c) => c.status === "Unsuccessful").length;
    const totalRounds = chainsData.reduce((sum, c) => sum + c.rounds, 0);
    const offerCount = chainsData.filter((c) =>
      c.interviews.some((i) => i.InterviewOutcome === "Offer")
    ).length;

    const monthlyActivity = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const month = date.toLocaleString("default", { month: "short" });
      const monthChains = chainsData.filter(
        (c) =>
          new Date(c.updatedAt).getMonth() === date.getMonth() &&
          new Date(c.updatedAt).getFullYear() === date.getFullYear()
      );
      return {
        month,
        active: monthChains.filter((c) => c.status === "Active").length,
        successful: monthChains.filter((c) => c.status === "Successful").length,
        unsuccessful: monthChains.filter((c) => c.status === "Unsuccessful").length,
      };
    });

    const clientCounts = chainsData.reduce((acc, c) => {
      const clientName = c.clientName || "Unknown";
      acc[clientName] = (acc[clientName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topClients = Object.entries(clientCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setStats({
      totalChains: chainsData.length,
      activeChains: active,
      successfulChains: successful,
      unsuccessfulChains: unsuccessful,
      statusBreakdown: [
        { status: "Active", count: active },
        { status: "Successful", count: successful },
        { status: "Unsuccessful", count: unsuccessful },
      ],
      monthlyActivity,
      averageRounds: chainsData.length ? totalRounds / chainsData.length : 0,
      offerRate: chainsData.length ? (offerCount / chainsData.length) * 100 : 0,
      topClients,
    });
  };

  const handleSelectChain = async (chain: InterviewChain) => {
    console.log("Selecting chain with ID:", chain.id);
    setSelectedChain(chain);
    setOpenChainExploration(true);
    setDetailLoading(true);
    setFetchError(null);

    try {
      const chainId = Number.parseInt(chain.id);
      if (isNaN(chainId)) {
        throw new Error(`Invalid chain ID: ${chain.id}`);
      }
      console.log("Fetching detailed chain for ID:", chainId);
      const detailedChain = await getInterviewChain(chainId);
      console.log("Fetched detailed chain:", detailedChain);

      if (detailedChain) {
        setSelectedChain(detailedChain);
        setChains((prev) =>
          prev.map((c) => (c.id === chain.id ? detailedChain : c))
        );
        updateStats(chains.map((c) => (c.id === chain.id ? detailedChain : c)));
      } else {
        console.error("Detailed chain not found for ID:", chain.id);
        setFetchError("Chain details not found");
      }
    } catch (error: any) {
      console.error("Failed to fetch detailed chain:", {
        message: error.message,
        stack: error.stack,
        chainId: chain.id,
      });
      setFetchError("Failed to load chain details");
    } finally {
      setDetailLoading(false);
    }
  };

  const addInterview = async (
    chainId: string,
    newInterview: Partial<Interview>
  ) => {
    if (isSubmitting || detailLoading) {
      console.log("Already submitting, ignoring additional request");
      return;
    }

    setIsSubmitting(true);
    setDetailLoading(true);
    setFetchError(null);

    try {
      console.log("Adding interview to chain ID:", chainId);
      const payload: InterviewChainAdd = {
        interviewChainID: Number.parseInt(chainId),
        interviewDate: newInterview.InterviewDate
          ? new Date(newInterview.InterviewDate).toISOString()
          : null,
        interviewStartTime: newInterview.InterviewStartTime || null,
        interviewEndTime: newInterview.InterviewEndTime || null,
        interviewMethod: newInterview.InterviewMethod || null,
        interviewType: newInterview.InterviewType || null,
        interviewStatus: "Scheduled",
        interviewSupport: newInterview.InterviewSupport || null, // Added
        comments: newInterview.Comments || null,
      };

      if (newInterview.ParentInterviewChainID) {
        console.log("Using ParentInterviewChainID:", newInterview.ParentInterviewChainID);
        payload.parentInterviewChainID = newInterview.ParentInterviewChainID;
      }

      await addInterviewToChain(Number.parseInt(chainId), payload);
      console.log("Interview added successfully");

      const parentChainId = selectedChain?.id || chainId;
      console.log("Fetching updated chain with parent ID:", parentChainId);

      const updatedChain = await getInterviewChain(Number.parseInt(parentChainId));
      if (updatedChain) {
        setChains((prev) =>
          prev.map((c) => (c.id === parentChainId ? updatedChain : c))
        );
        updateStats(chains.map((c) => (c.id === parentChainId ? updatedChain : c)));
        setSelectedChain(updatedChain);
      }

      await fetchChains();
    } catch (error) {
      console.error("Failed to add new interview:", error);
      setFetchError("Failed to add new interview");
    } finally {
      setDetailLoading(false);
      setIsSubmitting(false);
    }
  };

  const editInterview = async (
    chainId: string,
    selectedInterview: Interview,
    newInterview: Partial<Interview> & {
      clientName?: string;
      position?: string;
    }
  ) => {
    if (isSubmitting || detailLoading) {
      console.log("Already submitting, ignoring additional request");
      return;
    }

    setIsSubmitting(true);
    setDetailLoading(true);
    setFetchError(null);

    try {
      console.log("Editing interview with ID:", selectedInterview.InterviewChainID);
      const payload: InterviewChainUpdate = {
        interviewChainID: selectedInterview.InterviewChainID,
        chainStatus: newInterview.ChainStatus || "Active",
        interviewDate: newInterview.InterviewDate
          ? new Date(newInterview.InterviewDate).toISOString()
          : null,
        interviewStartTime: newInterview.InterviewStartTime || null,
        interviewEndTime: newInterview.InterviewEndTime || null,
        interviewMethod: newInterview.InterviewMethod || null,
        interviewStatus: newInterview.InterviewStatus || "Scheduled",
        interviewOutcome: newInterview.InterviewOutcome || null,
        interviewSupport: newInterview.InterviewSupport || null, // Added
        interviewFeedback: newInterview.InterviewFeedback || null,
        comments: newInterview.Comments || null,
      };

      await updateInterviewChain(selectedInterview.InterviewChainID, payload);
      console.log("Interview updated successfully");

      const updatedChain = await getInterviewChain(Number.parseInt(chainId));
      if (updatedChain) {
        setChains((prev) =>
          prev.map((c) => (c.id === chainId ? updatedChain : c))
        );
        updateStats(chains.map((c) => (c.id === chainId ? updatedChain : c)));
        setSelectedChain(updatedChain);
      }

      await fetchChains();
    } catch (error) {
      console.error("Failed to edit interview:", error);
      setFetchError("Failed to edit interview");
    } finally {
      setDetailLoading(false);
      setIsSubmitting(false);
    }
  };

  const endInterview = async (
    chainId: string,
    outcome: "Next" | "Rejected" | "Offer",
    newInterview?: Partial<Interview> & {
      clientName?: string;
      position?: string;
    }
  ) => {
    if (isSubmitting || detailLoading) {
      console.log("Already submitting, ignoring additional request");
      return;
    }

    setIsSubmitting(true);
    setDetailLoading(true);
    setFetchError(null);

    try {
      console.log("Ending interview with chain ID:", chainId, "and outcome:", outcome);
      const payload: InterviewChainEnd = {
        interviewChainID: Number.parseInt(chainId),
        interviewOutcome: outcome,
        interviewFeedback: newInterview?.InterviewFeedback || null,
        comments: newInterview?.Comments || null,
      };

      await endInterviewChain(Number.parseInt(chainId), payload);
      console.log("Interview ended successfully");

      const parentChainId = selectedChain?.id || chainId;
      console.log("Fetching updated chain with parent ID:", parentChainId);

      const updatedChain = await getInterviewChain(Number.parseInt(parentChainId));
      if (updatedChain) {
        setChains((prev) =>
          prev.map((c) => (c.id === parentChainId ? updatedChain : c))
        );
        updateStats(chains.map((c) => (c.id === parentChainId ? updatedChain : c)));
        setSelectedChain(updatedChain);
      }

      await fetchChains();
    } catch (error) {
      console.error("Failed to end interview:", error);
      setFetchError("Failed to end interview");
    } finally {
      setDetailLoading(false);
      setIsSubmitting(false);
    }
  };

  const updateChainStatus = async (chainId: string, newStatus: string) => {
    if (isSubmitting || detailLoading) {
      console.log("Already submitting, ignoring additional request");
      return;
    }

    setIsSubmitting(true);
    setDetailLoading(true);
    setFetchError(null);

    try {
      console.log("Updating chain status for ID:", chainId, "to:", newStatus);
      const payload: InterviewChainUpdate = {
        interviewChainID: Number.parseInt(chainId),
        chainStatus: newStatus,
        comments: `Status updated to ${newStatus} on ${new Date().toISOString()}`,
      };

      await updateInterviewChain(Number.parseInt(chainId), payload);
      console.log("Chain status updated successfully");

      const updatedChain = await getInterviewChain(Number.parseInt(chainId));
      if (updatedChain) {
        setChains((prev) =>
          prev.map((c) => (c.id === chainId ? updatedChain : c))
        );
        updateStats(chains.map((c) => (c.id === chainId ? updatedChain : c)));
        setSelectedChain(updatedChain);
      }

      await fetchChains();
    } catch (error) {
      console.error("Failed to update chain status:", error);
      setFetchError("Failed to update chain status");
    } finally {
      setDetailLoading(false);
      setIsSubmitting(false);
    }
  };

  const createNewChain = async (
    newInterview?: Partial<Interview> & {
      clientName?: string;
      position?: string;
      recruiterName?: string;
    }
  ) => {
    if (isSubmitting || detailLoading) {
      console.log("Already submitting, ignoring additional request");
      return;
    }

    setIsSubmitting(true);
    setDetailLoading(true);
    setFetchError(null);

    try {
      console.log("Creating new interview chain with data:", newInterview);

      const payload = {
        clientID: newInterview?.ClientID || null,
        endClientName: newInterview?.EndClientName || "New Client",
        position: newInterview?.position || "New Position",
        recruiterID: newInterview?.RecruiterID || null,
        interviewEntryDate: new Date().toISOString(),
        interviewDate: newInterview?.InterviewDate
          ? new Date(newInterview.InterviewDate).toISOString()
          : new Date().toISOString(),
        interviewStartTime: newInterview?.InterviewStartTime || null,
        interviewEndTime: newInterview?.InterviewEndTime || null,
        interviewMethod: newInterview?.InterviewMethod || null,
        interviewType: newInterview?.InterviewType || "Phone",
        interviewStatus: newInterview?.InterviewStatus || "Scheduled",
        interviewSupport: newInterview?.InterviewSupport || null, // Added
        comments: newInterview?.Comments || null,
      };

      console.log("Payload being sent to API:", payload);
      const newChainId = await createInterviewChain(payload);
      console.log("New chain created with ID:", newChainId);

      const newChain = await getInterviewChain(newChainId);
      if (newChain) {
        setChains((prev) => [...prev, newChain]);
        updateStats([...chains, newChain]);
        setSelectedChain(newChain);
      }

      await fetchChains();
    } catch (error) {
      console.error("Failed to create new chain:", error);
      setFetchError("Failed to create new chain");
    } finally {
      setDetailLoading(false);
      setIsSubmitting(false);
    }
  };

  return {
    chains,
    stats,
    loading,
    detailLoading,
    isSubmitting,
    fetchError,
    selectedChain,
    setSelectedChain: handleSelectChain,
    openChainExploration,
    setOpenChainExploration,
    fetchChains,
    addInterview,
    editInterview,
    endInterview,
    updateChainStatus,
    createNewChain,
  };
};