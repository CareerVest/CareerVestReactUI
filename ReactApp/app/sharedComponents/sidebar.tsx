// "use client";

// import { useState, useEffect, useRef } from "react"; // Added useRef for timeout control
// import {
//   Box,
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   IconButton,
//   Typography,
//   Tooltip,
//   Avatar,
// } from "@mui/material";
// import {
//   Speed,
//   BusinessCenter,
//   Group,
//   TrendingUp,
//   Settings,
//   ChevronLeft,
//   ChevronRight,
//   ExitToApp,
// } from "@mui/icons-material";
// import { People as InterviewIcon } from "@mui/icons-material";
// import { BarChart as OrganizationChart, DollarSign } from "lucide-react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useAuth } from "@/contexts/authContext";
// import { AppPermissions } from "../utils/permissions";

// interface SidebarProps {
//   permissions: AppPermissions;
//   userRole: string;
//   isCollapsed: boolean;
//   setIsCollapsed: (value: boolean) => void;
// }

// type PermissionKey =
//   | "view"
//   | "addClient"
//   | "viewClient"
//   | "editClient"
//   | "deleteClient"
//   | "addEmployee"
//   | "viewEmployee"
//   | "editEmployee"
//   | "deleteEmployee"
//   | "addInterview"
//   | "viewInterview"
//   | "editInterview"
//   | "deleteInterview";

// const menuItems = [
//   {
//     title: "Dashboard",
//     icon: <Speed />,
//     path: "/",
//     permissionKey: "view" as PermissionKey,
//   },
//   {
//     title: "Clients",
//     icon: <BusinessCenter />,
//     path: "/clients",
//     permissionKey: "viewClient" as PermissionKey,
//   },
//   {
//     title: "Employees",
//     icon: <Group />,
//     path: "/employees",
//     permissionKey: "viewEmployee" as PermissionKey,
//   },
//   {
//     title: "Marketing Activity",
//     icon: <TrendingUp />,
//     path: "/marketingActivity",
//     permissionKey: "view" as PermissionKey,
//   },
//   {
//     title: "Interviews",
//     icon: <InterviewIcon />,
//     path: "/interviews",
//     permissionKey: "viewInterview" as PermissionKey,
//   },
//   {
//     title: "Team Hierarchy",
//     icon: <OrganizationChart />,
//     path: "/supervisors",
//     permissionKey: "view" as PermissionKey,
//   },
//   {
//     title: "Accounting",
//     icon: <DollarSign />,
//     path: "/accounting",
//     permissionKey: "view" as PermissionKey,
//   },
//   {
//     title: "Settings",
//     icon: <Settings />,
//     path: "/settings",
//     permissionKey: "view" as PermissionKey,
//   },
// ];

// export default function Sidebar({
//   permissions,
//   userRole,
//   isCollapsed,
//   setIsCollapsed,
// }: SidebarProps) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { user, logout } = useAuth();
//   const [mounted, setMounted] = useState(false);
//   const [userData, setUserData] = useState<any>(null);
//   const [hover, setHover] = useState(false);
//   const [clickPending, setClickPending] = useState(false); // Flag to prevent re-expansion after click
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to store timeout ID

//   useEffect(() => {
//     setMounted(true);
//     // Navigate to dashboard and collapse sidebar on initial load
//     if (!pathname || pathname === "/") {
//       setIsCollapsed(true);
//     }
//   }, [pathname, router, setIsCollapsed]);

//   useEffect(() => {
//     if (user) {
//       setUserData(user);
//     } else {
//       const storedUser = JSON.parse(localStorage.getItem("user") || "null");
//       if (storedUser) {
//         setUserData(storedUser);
//       }
//     }
//   }, [user]);

//   const handleLogout = () => {
//     if (user) {
//       logout();
//       router.push("/login");
//     }
//   };

//   // Collapse sidebar after clicking a menu item
//   const handleMenuClick = () => {
//     if (!isCollapsed) {
//       setClickPending(true); // Set flag to prevent re-expansion
//       setIsCollapsed(true);
//       setTimeout(() => setClickPending(false), 300); // Reset after transition
//     }
//   };

//   // Expand sidebar on hover
//   const handleMouseEnter = () => {
//     if (!clickPending) {
//       // Only expand if not pending collapse from click
//       setHover(true);
//       if (isCollapsed) {
//         setIsCollapsed(false);
//       }
//     }
//   };

//   // Collapse sidebar on mouse leave
//   const handleMouseLeave = () => {
//     setHover(false);
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current); // Clear any existing timeout
//     }
//     if (!isCollapsed && !clickPending) {
//       timeoutRef.current = setTimeout(() => {
//         setIsCollapsed(true);
//       }, 300); // Delay to allow clicking
//     }
//   };

//   if (!mounted) {
//     return null;
//   }

//   return (
//     <Drawer
//       variant="permanent"
//       open={!isCollapsed}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       sx={{
//         width: isCollapsed ? 80 : 280,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: isCollapsed ? 80 : 280,
//           boxSizing: "border-box",
//           borderRight: "none",
//           transition: "width 0.3s ease",
//           backgroundColor: "#682A53",
//           color: "white",
//           overflowX: "hidden",
//           display: "flex",
//           flexDirection: "column",
//           margin: 0,
//           padding: 0,
//         },
//       }}
//     >
//       <Box
//         sx={{
//           p: 2,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         {!isCollapsed && (
//           <Typography
//             variant="h6"
//             noWrap
//             component="div"
//             sx={{ flexGrow: 1, color: "white" }}
//           >
//             CareerVest
//           </Typography>
//         )}
//         <IconButton
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           sx={{ color: "white" }}
//         >
//           {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
//         </IconButton>
//       </Box>

//       <Box sx={{ px: 2, py: 3 }}>
//         <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//           <Avatar
//             sx={{ width: 40, height: 40, mr: isCollapsed ? 0 : 2 }}
//             src={""}
//           />
//           {!isCollapsed && userData && (
//             <Box>
//               <Typography variant="subtitle1" noWrap sx={{ color: "white" }}>
//                 {userData.name || "User"}
//               </Typography>
//               <Typography
//                 variant="body2"
//                 sx={{ color: "rgba(255, 255, 255, 0.7)" }}
//                 noWrap
//               >
//                 {userData.email || userData.username || "No email"}
//               </Typography>
//             </Box>
//           )}
//         </Box>
//       </Box>

//       <List>
//         {menuItems.map((item) => {
//           const module = item.title.toLowerCase();
//           let hasPermission = false;

//           if (userRole === "Admin") {
//             hasPermission = true;
//           } else if (module === "dashboard") {
//             hasPermission = true;
//           } else if (module === "marketing activity") {
//             hasPermission = true;
//           } else if (module in permissions) {
//             const permissionType = permissions[module as keyof AppPermissions];
//             hasPermission =
//               permissionType?.[userRole]?.[item.permissionKey] === true;
//           }

//           if (hasPermission) {
//             return (
//               <ListItem key={item.title} disablePadding>
//                 <Tooltip
//                   title={isCollapsed ? item.title : ""}
//                   placement="right"
//                 >
//                   <ListItemButton
//                     component={Link}
//                     href={item.path}
//                     onClick={handleMenuClick}
//                     sx={{
//                       minHeight: 48,
//                       px: 2.5,
//                       bgcolor:
//                         pathname === item.path
//                           ? "rgba(253, 197, 0, 0.2)"
//                           : "transparent",
//                       "&:hover": {
//                         bgcolor: "rgba(253, 197, 0, 0.1)",
//                       },
//                     }}
//                   >
//                     <ListItemIcon
//                       sx={{
//                         minWidth: 0,
//                         mr: isCollapsed ? 0 : 3,
//                         justifyContent: "center",
//                         color: pathname === item.path ? "#FDC500" : "white",
//                       }}
//                     >
//                       {item.icon}
//                     </ListItemIcon>
//                     {!isCollapsed && (
//                       <ListItemText
//                         primary={item.title}
//                         sx={{
//                           color: pathname === item.path ? "#FDC500" : "white",
//                         }}
//                       />
//                     )}
//                   </ListItemButton>
//                 </Tooltip>
//               </ListItem>
//             );
//           }
//           return null;
//         })}
//         <ListItem disablePadding sx={{ mt: "auto" }}>
//           <Tooltip title={isCollapsed ? "Logout" : ""} placement="right">
//             <ListItemButton
//               onClick={handleLogout}
//               sx={{
//                 minHeight: 48,
//                 px: 2.5,
//                 "&:hover": {
//                   bgcolor: "rgba(253, 197, 0, 0.1)",
//                 },
//               }}
//             >
//               <ListItemIcon
//                 sx={{
//                   minWidth: 0,
//                   mr: isCollapsed ? 0 : 3,
//                   justifyContent: "center",
//                   color: "white",
//                 }}
//               >
//                 <ExitToApp />
//               </ListItemIcon>
//               {!isCollapsed && (
//                 <ListItemText primary="Logout" sx={{ color: "white" }} />
//               )}
//             </ListItemButton>
//           </Tooltip>
//         </ListItem>
//       </List>
//     </Drawer>
//   );
// }





"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  Speed,
  BusinessCenter,
  Group,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExitToApp,
} from "@mui/icons-material";
import { People as InterviewIcon } from "@mui/icons-material";
import { BarChartIcon as OrganizationChart, DollarSign } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { AppPermissions } from "../utils/permissions";

interface SidebarProps {
  permissions: AppPermissions;
  userRole: string;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

type PermissionKey =
  | "view"
  | "addClient"
  | "viewClient"
  | "editClient"
  | "deleteClient"
  | "addEmployee"
  | "viewEmployee"
  | "editEmployee"
  | "deleteEmployee"
  | "addInterview"
  | "viewInterview"
  | "editInterview"
  | "deleteInterview";

const menuItems = [
  { title: "Dashboard", icon: <Speed />, path: "/", permissionKey: "view" as PermissionKey },
  { title: "Clients", icon: <BusinessCenter />, path: "/clients", permissionKey: "viewClient" as PermissionKey },
  { title: "Employees", icon: <Group />, path: "/employees", permissionKey: "viewEmployee" as PermissionKey },
  { title: "Marketing Activity", icon: <TrendingUp />, path: "/marketingActivity", permissionKey: "view" as PermissionKey },
  { title: "Interviews", icon: <InterviewIcon />, path: "/interviews", permissionKey: "viewInterview" as PermissionKey },
  { title: "Team Hierarchy", icon: <OrganizationChart />, path: "/supervisors", permissionKey: "view" as PermissionKey },
  { title: "Accounting", icon: <DollarSign />, path: "/accounting", permissionKey: "view" as PermissionKey },
  { title: "Settings", icon: <Settings />, path: "/settings", permissionKey: "view" as PermissionKey },
];

export default function Sidebar({ permissions, userRole, isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setUserData(user);
    } else {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (storedUser) {
        setUserData(storedUser);
      }
    }
  }, [user]);

  const handleLogout = () => {
    if (user) {
      logout();
      router.push("/login");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      open={!isCollapsed}
      sx={{
        width: isCollapsed ? 80 : 280,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isCollapsed ? 80 : 280,
          boxSizing: "border-box",
          borderRight: "none",
          transition: "width 0.3s ease",
          backgroundColor: "#682A53",
          color: "white",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          margin: 0, // Ensure no margin
          padding: 0, // Ensure no padding
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {!isCollapsed && (
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: "white" }}>
            CareerVest
          </Typography>
        )}
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)} sx={{ color: "white" }}>
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      <Box sx={{ px: 2, py: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar sx={{ width: 40, height: 40, mr: isCollapsed ? 0 : 2 }} src={""} />
          {!isCollapsed && userData && (
            <Box>
              <Typography variant="subtitle1" noWrap sx={{ color: "white" }}>
                {userData.name || "User"}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }} noWrap>
                {userData.email || userData.username || "No email"}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <List>
        {menuItems.map((item) => {
          const module = item.title.toLowerCase();
          let hasPermission = false;

          if (userRole === "Admin") {
            hasPermission = true;
          } else if (module === "dashboard") {
            hasPermission = true;
          } else if (module === "marketing activity") {
            hasPermission = true; // Explicitly allow "Marketing Activity" for all roles, as it's tied to "view"
          } else if (module in permissions) {
            const permissionType = permissions[module as keyof AppPermissions];
            hasPermission = permissionType?.[userRole]?.[item.permissionKey] === true;
          }

          if (hasPermission) {
            return (
              <ListItem key={item.title} disablePadding>
                <Tooltip title={isCollapsed ? item.title : ""} placement="right">
                  <ListItemButton
                    component={Link}
                    href={item.path}
                    sx={{
                      minHeight: 48,
                      px: 2.5,
                      bgcolor: pathname === item.path ? "rgba(253, 197, 0, 0.2)" : "transparent",
                      "&:hover": {
                        bgcolor: "rgba(253, 197, 0, 0.1)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isCollapsed ? 0 : 3,
                        justifyContent: "center",
                        color: pathname === item.path ? "#FDC500" : "white",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!isCollapsed && (
                      <ListItemText
                        primary={item.title}
                        sx={{
                          color: pathname === item.path ? "#FDC500" : "white",
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          }
          return null;
        })}
        <ListItem disablePadding sx={{ mt: "auto" }}>
          <Tooltip title={isCollapsed ? "Logout" : ""} placement="right">
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                px: 2.5,
                "&:hover": {
                  bgcolor: "rgba(253, 197, 0, 0.1)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 3,
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <ExitToApp />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary="Logout" sx={{ color: "white" }} />}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Drawer>
  );
}