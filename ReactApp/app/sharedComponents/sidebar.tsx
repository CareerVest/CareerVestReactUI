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
import { People as InterviewIcon } from "@mui/icons-material"; // Updated icon for Interviews
import { BarChartIcon as OrganizationChart, DollarSign } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { AppPermissions } from "../utils/permissions"; // Import for type safety

interface SidebarProps {
  permissions: AppPermissions;
  userRole: string;
}

// Define valid permission keys for each module
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
  { title: "Dashboard", icon: <Speed />, path: "/", permissionKey: "view" as PermissionKey }, // Default permission, always visible
  { title: "Clients", icon: <BusinessCenter />, path: "/clients", permissionKey: "viewClient" as PermissionKey },
  { title: "Employees", icon: <Group />, path: "/employees", permissionKey: "viewEmployee" as PermissionKey },
  { title: "Marketing Activity", icon: <TrendingUp />, path: "/marketing", permissionKey: "view" as PermissionKey }, // Placeholder
  { title: "Interviews", icon: <InterviewIcon />, path: "/interviews", permissionKey: "viewInterview" as PermissionKey },
  { title: "Team Hierarchy", icon: <OrganizationChart />, path: "/supervisors", permissionKey: "view" as PermissionKey }, // Placeholder
  { title: "Accounting", icon: <DollarSign />, path: "/accounting", permissionKey: "view" as PermissionKey }, // Placeholder
  { title: "Settings", icon: <Settings />, path: "/settings", permissionKey: "view" as PermissionKey }, // Placeholder
];

export default function Sidebar({ permissions, userRole }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth(); // Removed roles, as userRole is now a prop
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
      // Log out the specific active account silently without prompting
      logout();
      // Manually redirect to login page after logout
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
          const module = item.title.toLowerCase(); // String type, not keyof AppPermissions
          let hasPermission = false;

          // Always show all items for Admin
          if (userRole === "Admin") {
            hasPermission = true;
          } 
          // Always show Dashboard for all roles
          else if (module === "dashboard") {
            hasPermission = true;
          }
          // Check permissions for other modules
          else if (module in permissions) {
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
                    <ListItemIcon // Ensure proper closing tag
                      sx={{
                        minWidth: 0,
                        mr: isCollapsed ? 0 : 3,
                        justifyContent: "center",
                        color: pathname === item.path ? "#FDC500" : "white",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon> {/* Added closing tag */}
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
              <ListItemIcon // Ensure proper closing tag
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 3,
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <ExitToApp />
              </ListItemIcon> {/* Added closing tag */}
              {!isCollapsed && <ListItemText primary="Logout" sx={{ color: "white" }} />}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Drawer>
  );
}