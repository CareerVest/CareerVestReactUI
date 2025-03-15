"use client";

import { useState, useEffect } from "react";
import type {
  Interview,
  InterviewChain,
} from "@/app/types/interviewChain/interviewChain";
import { getClientsForRecruiterId } from "@/app/clients/actions/clientActions";
import { getRecruiters } from "@/app/employees/actions/employeeActions";
import type { ClientList } from "@/app/types/Clients/ClientList";
import type { Recruiter } from "@/app/types/employees/recruiter";

export const useInterviewForm = (
  chain: InterviewChain,
  isEditing: boolean,
  interviewToEdit?: Interview,
  selectedInterview?: Interview
) => {
  const [newInterview, setNewInterview] = useState<
    Partial<Interview> & {
      clientName?: string;
      position?: string;
      recruiterName?: string;
    }
  >({
    InterviewChainID: chain.id ? parseInt(chain.id) : 0,
    ParentInterviewChainID: selectedInterview
      ? selectedInterview.InterviewChainID
      : interviewToEdit
      ? interviewToEdit.ParentInterviewChainID
      : chain.interviews.length > 0
      ? chain.interviews[chain.interviews.length - 1].InterviewChainID
      : null,
    EndClientName: chain.endClientName || "",
    Position: chain.position || "",
    ChainStatus: chain.status || "Active",
    InterviewDate: null,
    InterviewStartTime: null,
    InterviewEndTime: null,
    InterviewMethod: null,
    InterviewType: null,
    InterviewStatus: "Scheduled",
    InterviewOutcome: null,
    InterviewSupport: null,
    InterviewFeedback: null,
    Comments: null,
    CreatedTS: new Date(),
    UpdatedTS: new Date(),
    CreatedBy: null,
    UpdatedBy: null,
    RecruiterID: null,
    ClientID: null,
    clientName: chain.clientName || "",
    position: chain.position || "",
    recruiterName: chain.recruiterName || "",
  });
  const [errors, setErrors] = useState({
    InterviewMethod: false,
    InterviewType: false,
    InterviewDate: false,
    InterviewStartTime: false, // Added
    InterviewEndTime: false, // Added
    ClientID: false,
    RecruiterID: false,
    position: false,
    chainStatus: false,
    interviewStatus: false,
    EndClientName: false,
  });
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<ClientList[]>([]);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);

  useEffect(() => {
    if (selectedInterview) {
      console.log(
        "useInterviewForm: Setting ParentInterviewChainID from selectedInterview:",
        selectedInterview.InterviewChainID
      );
      setNewInterview((prev) => {
        const updated = {
          ...prev,
          ParentInterviewChainID: selectedInterview.InterviewChainID,
          RecruiterID: selectedInterview.RecruiterID || prev.RecruiterID,
        };
        console.log(
          "useInterviewForm: Updated state after selectedInterview:",
          updated
        );
        return updated;
      });
    }
  }, [selectedInterview]);

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const recruitersData = await getRecruiters();
        const recruiterList = Array.isArray(recruitersData.$values)
          ? recruitersData.$values
          : [];
        const mappedRecruiters: Recruiter[] = recruiterList
          .map((recruiter: Recruiter) => ({
            employeeID: recruiter.employeeID,
            firstName: recruiter.firstName || "Unknown",
            lastName: recruiter.lastName || "Recruiter",
          }))
          .filter((recruiter) => recruiter.employeeID !== undefined);
        setRecruiters(mappedRecruiters);
      } catch (error) {
        console.error("Failed to fetch recruiters:", error);
        setRecruiters([]);
      }
    };
    fetchRecruiters();
  }, []);

  useEffect(() => {
    if (!isEditing && newInterview.RecruiterID) {
      const fetchClients = async () => {
        try {
          setLoading(true);
          const clientData = await getClientsForRecruiterId(
            newInterview.RecruiterID as number
          );
          const mappedClients: ClientList[] = clientData.$values
            .map((client: ClientList) => ({
              clientID: client.clientID,
              clientName: client.clientName || "Unknown Client",
              enrollmentDate: client.enrollmentDate || null,
              techStack: client.techStack || null,
              clientStatus: client.clientStatus || null,
              salesPerson: client.salesPerson || null,
              assignedRecruiterName: client.assignedRecruiterName || null,
            }))
            .filter((client) => client.clientID !== undefined);
          setClients(mappedClients);
        } catch (error) {
          console.error("Failed to fetch clients for recruiter:", error);
          setClients([]);
        } finally {
          setLoading(false);
        }
      };
      fetchClients();
    }
  }, [isEditing, newInterview.RecruiterID]);

  const handleInputChange = (
    field: keyof (Partial<Interview> & {
      clientName?: string;
      position?: string;
      recruiterName?: string;
    }),
    value: string | number | Date | null
  ) => {
    setNewInterview((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "InterviewDate" && typeof value === "string" && value) {
        updated[field] = new Date(value);
      }
      if (field === "ParentInterviewChainID") {
        console.log(
          "useInterviewForm: Setting ParentInterviewChainID via handleInputChange:",
          value
        );
      }
      console.log(
        "useInterviewForm: Updated state after handleInputChange:",
        updated
      );
      return updated;
    });

    const requiredFields = [
      "InterviewMethod",
      "InterviewType",
      "InterviewDate",
      "InterviewStartTime", // Added
      "InterviewEndTime", // Added
      "ClientID",
      "RecruiterID",
      "position",
      "chainStatus",
      "interviewStatus",
      "EndClientName",
    ];
    if (requiredFields.includes(field as string)) {
      setErrors((prev) => ({
        ...prev,
        [field]: !value || (typeof value === "string" && value.trim() === ""),
      }));
    }
  };

  const handleAutocompleteChange = (
    field: keyof (Partial<Interview> & {
      clientName?: string;
      position?: string;
      recruiterName?: string;
    }),
    value: string | number | null
  ) => {
    setNewInterview((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "ClientID" && value !== null) {
        const selectedClient = clients.find((c) => c.clientID === value);
        updated.clientName = selectedClient?.clientName || prev.clientName;
      }
      if (field === "RecruiterID" && value !== null) {
        const selectedRecruiter = recruiters.find(
          (r) => r.employeeID === value
        );
        updated.recruiterName = selectedRecruiter
          ? `${selectedRecruiter.firstName} ${selectedRecruiter.lastName}`
          : prev.recruiterName;
      }
      console.log(
        "useInterviewForm: Updated state after handleAutocompleteChange:",
        updated
      );
      return updated;
    });

    setErrors((prev) => ({
      ...prev,
      [field]: !value,
    }));
  };

  const validateAndSubmit = (
    outcome: "AddNew" | "Edit",
    onSubmit: (
      chainId: string,
      outcome: "AddNew" | "Edit",
      newInterview?: Partial<Interview> & {
        clientName?: string;
        position?: string;
        recruiterName?: string;
      }
    ) => void
  ) => {
    const methodError = !newInterview.InterviewMethod && !isEditing;
    const typeError = !newInterview.InterviewType && !isEditing;
    const dateError = !newInterview.InterviewDate;
    const startTimeError = !newInterview.InterviewStartTime && !isEditing; // Added
    const endTimeError = !newInterview.InterviewEndTime && !isEditing; // Added

    const clientError =
      !isEditing && outcome === "AddNew" && !chain.id && !newInterview.ClientID; // Updated
    const recruiterError =
      !isEditing && outcome === "AddNew" && !newInterview.RecruiterID;
    const positionError =
      !isEditing && outcome === "AddNew" && !newInterview.position;
    const chainStatusError =
      !isEditing && outcome === "AddNew" && !newInterview.ChainStatus;
    const interviewStatusError = !isEditing && !newInterview.InterviewStatus;
    const endClientNameError =
      !isEditing && outcome === "AddNew" && !newInterview.EndClientName;

    console.log("Validation errors:", {
      methodError,
      typeError,
      dateError,
      startTimeError,
      endTimeError,
      clientError,
      recruiterError,
      positionError,
      chainStatusError,
      interviewStatusError,
      endClientNameError,
    });

    if (
      methodError ||
      typeError ||
      dateError ||
      startTimeError ||
      endTimeError ||
      clientError ||
      recruiterError ||
      positionError ||
      chainStatusError ||
      interviewStatusError ||
      endClientNameError
    ) {
      setErrors({
        InterviewMethod: methodError,
        InterviewType: typeError,
        InterviewDate: dateError,
        InterviewStartTime: startTimeError, // Added
        InterviewEndTime: endTimeError, // Added
        ClientID: clientError,
        RecruiterID: recruiterError,
        position: positionError,
        chainStatus: chainStatusError,
        interviewStatus: interviewStatusError,
        EndClientName: endClientNameError,
      });
      console.log("Validation failed, errors set:", errors);
      return;
    }

    if (selectedInterview && !newInterview.ParentInterviewChainID) {
      console.log(
        "Setting ParentInterviewChainID before submission:",
        selectedInterview.InterviewChainID
      );
      setNewInterview((prev) => ({
        ...prev,
        ParentInterviewChainID: selectedInterview.InterviewChainID,
      }));
    }

    console.log(
      "Validation passed, submitting with ParentInterviewChainID:",
      newInterview.ParentInterviewChainID
    );
    setLoading(true);

    const targetId = selectedInterview?.InterviewChainID
      ? selectedInterview.InterviewChainID.toString()
      : chain.id;

    console.log("Submitting with targetId:", targetId);
    onSubmit(targetId, outcome, newInterview);
    setLoading(false);
  };

  return {
    newInterview,
    setNewInterview,
    errors,
    recruiters,
    clients,
    loading,
    handleInputChange,
    handleAutocompleteChange,
    validateAndSubmit,
  };
};
