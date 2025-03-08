// "use client";

// import { useState } from "react";
// import { Box, Typography, Container, Button } from "@mui/material";
// import { Dashboard } from "@mui/icons-material";
// import { useRouter } from "next/navigation";
// import InterviewChainHub from "../../components/interview-chain/InterviewChainHub";
// import { dummyInterviewChains } from "../../utils/dummyInterviewChainData";
// import type { Interview, InterviewChain } from "../../types/interview-chain";

// export default function InterviewChainSearchPage() {
//   const router = useRouter();
//   const [chains, setChains] = useState<InterviewChain[]>(dummyInterviewChains);

//   // Handle end interview
//   const handleEndInterview = (
//     chainId: string,
//     outcome: "Next" | "Rejected" | "Offer",
//     newInterview?: Partial<Interview>,
//   ) => {
//     setChains((prevChains) =>
//       prevChains.map((chain) => {
//         if (chain.id === chainId) {
//           // Update the latest interview
//           const updatedInterviews = [...chain.interviews];
//           const latestInterviewIndex = updatedInterviews.length - 1;
//           updatedInterviews[latestInterviewIndex] = {
//             ...updatedInterviews[latestInterviewIndex],
//             status: "Completed",
//             outcome,
//           };

//           // Add new interview if outcome is "Next"
//           if (outcome === "Next" && newInterview) {
//             updatedInterviews.push({
//               id: `interview-${Math.random().toString(36).substring(2, 9)}`,
//               type: newInterview.type || "Follow-up",
//               date: newInterview.date || new Date().toISOString(),
//               status: "Scheduled",
//               notes: newInterview.notes,
//               location: newInterview.location,
//             });
//           }

//           // Update chain status
//           let newStatus = chain.status;
//           if (outcome === "Rejected") {
//             newStatus = "Unsuccessful";
//           } else if (outcome === "Offer") {
//             newStatus = "Successful";
//           }

//           return {
//             ...chain,
//             interviews: updatedInterviews,
//             status: newStatus,
//             updatedAt: new Date().toISOString(),
//           };
//         }
//         return chain;
//       }),
//     );
//   };

//   return (
//     <Container maxWidth="xl">
//       <Box sx={{ py: 4 }}>
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//           <div>
//             <Typography variant="h4" component="h1" gutterBottom>
//               Search & Manage Interview Chains
//             </Typography>
//             <Typography variant="subtitle1" color="text.secondary">
//               Find and manage interview chains across all clients
//             </Typography>
//           </div>
//           <Button
//             variant="outlined"
//             startIcon={<Dashboard />}
//             onClick={() => router.push("/interview-chain")}
//           >
//             View Dashboard
//           </Button>
//         </Box>

//         <InterviewChainHub chains={chains} onEndInterview={handleEndInterview} />
//       </Box>
//     </Container>
//   );
// }