// "use client";

// import { useState } from "react";
// import { IconButton, Menu, MenuItem } from "@mui/material";
// import { MoreVert as MoreVertIcon } from "@mui/icons-material";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// // import { deleteClient } from "../actions/clientActions";
// import type { Client } from "../../types/Clients/ClientList";

// interface ClientActionsProps {
//   client: Client;
// }

// export default function ClientActions({ client }: ClientActionsProps) {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const router = useRouter();

//   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   // const handleDelete = async () => {
//   //   if (confirm(`Are you sure you want to delete ${client.ClientName}?`)) {
//   //     try {
//   //       await deleteClient(client.ClientID);
//   //       router.refresh();
//   //     } catch (error) {
//   //       console.error("Failed to delete client:", error);
//   //       alert("Failed to delete client. Please try again.");
//   //     }
//   //   }
//   //   handleClose();
//   // };

//   return (
//     <>
//       <IconButton onClick={handleClick}>
//         <MoreVertIcon />
//       </IconButton>
//       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
//         <MenuItem component={Link} href={`/clients/${client.clientID}`}>
//           View
//         </MenuItem>
//         <MenuItem component={Link} href={`/clients/${client.clientID}/edit`}>
//           Edit
//         </MenuItem>
//         <MenuItem>Delete</MenuItem>
//       </Menu>
//     </>
//   );
// }
