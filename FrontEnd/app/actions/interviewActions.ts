import type { Interview, InterviewFormData } from "../types/interview"

// Dummy data
const dummyInterviews: Interview[] = [
  {
    InterviewID: 1,
    InterviewEntryDate: "2023-05-01",
    RecruiterID: 1,
    Technology: "React",
    InterviewDate: "2023-05-15",
    InterviewStartTime: "10:00 AM",
    InterviewMethod: "Video Call",
    ClientID: 1,
    InterviewType: "Technical",
    InterviewStatus: "Scheduled",
    InterviewSupport: "None required",
    InterviewFeedback: null,
    Comments: "Candidate seems promising",
    CreatedDate: "2023-05-01T09:00:00",
    ModifiedDate: "2023-05-01T09:00:00",
    EndClientName: "TechCorp Inc.",
    InterviewEndTime: "11:00 AM",
  },
  {
    InterviewID: 2,
    InterviewEntryDate: "2023-05-02",
    RecruiterID: 2,
    Technology: "Java",
    InterviewDate: "2023-05-16",
    InterviewStartTime: "02:00 PM",
    InterviewMethod: "In-person",
    ClientID: 2,
    InterviewType: "HR",
    InterviewStatus: "Completed",
    InterviewSupport: null,
    InterviewFeedback: "Candidate performed well",
    Comments: "Moving to next round",
    CreatedDate: "2023-05-02T10:00:00",
    ModifiedDate: "2023-05-16T15:00:00",
    EndClientName: "JavaSoft Solutions",
    InterviewEndTime: "03:00 PM",
  },
]

export async function fetchInterviews(): Promise<Interview[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return dummyInterviews
}

export async function getInterview(interviewId: number): Promise<Interview | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return dummyInterviews.find((interview) => interview.InterviewID === interviewId) || null
}

export async function createInterview(interviewData: InterviewFormData): Promise<Interview> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const newInterview: Interview = {
    InterviewID: Math.max(...dummyInterviews.map((i) => i.InterviewID)) + 1,
    ...interviewData,
    CreatedDate: new Date().toISOString(),
    ModifiedDate: new Date().toISOString(),
  }
  dummyInterviews.push(newInterview)
  return newInterview
}

export async function updateInterview(
  interviewId: number,
  interviewData: InterviewFormData,
): Promise<Interview | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const index = dummyInterviews.findIndex((interview) => interview.InterviewID === interviewId)
  if (index !== -1) {
    dummyInterviews[index] = { ...dummyInterviews[index], ...interviewData, ModifiedDate: new Date().toISOString() }
    return dummyInterviews[index]
  }
  return null
}

export async function deleteInterview(interviewId: number): Promise<boolean> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const index = dummyInterviews.findIndex((interview) => interview.InterviewID === interviewId)
  if (index !== -1) {
    dummyInterviews.splice(index, 1)
    return true
  }
  return false
}

