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
import { Timeline as InterviewChainIcon } from "@mui/icons-material"; // Replaced LinkChain with Timeline
import { BarChart as OrganizationChart, DollarSign } from "lucide-react";
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
  | "deleteInterview"
  | "addInterviewChain"
  | "viewInterviewChain"
  | "editInterviewChain"
  | "deleteInterviewChain";

const menuItems = [
  { title: "Dashboard", icon: <Speed />, path: "/", permissionKey: "view" },
  {
    title: "Clients",
    icon: <BusinessCenter />,
    path: "/clients",
    permissionKey: "viewClient",
  },
  {
    title: "Employees",
    icon: <Group />,
    path: "/employees",
    permissionKey: "viewEmployee",
  },
  {
    title: "Marketing Activity",
    icon: <TrendingUp />,
    path: "/marketingActivity",
    permissionKey: "view",
  },
  {
    title: "Interviews",
    icon: <InterviewIcon />,
    path: "/interviews",
    permissionKey: "viewInterview",
  },
  {
    title: "Interview Chains",
    icon: <InterviewChainIcon />,
    path: "/interviewChains",
    permissionKey: "viewInterviewChain",
  },
  {
    title: "Team Hierarchy",
    icon: <OrganizationChart />,
    path: "/supervisors",
    permissionKey: "view",
  },
  {
    title: "Accounting",
    icon: <DollarSign />,
    path: "/accounting",
    permissionKey: "view",
  },
  {
    title: "Settings",
    icon: <Settings />,
    path: "/settings",
    permissionKey: "view",
  },
];

export default function Sidebar({
  permissions,
  userRole,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
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

  const isInterviewChainsActive = pathname?.startsWith("/interviewChains");

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
          margin: 0,
          padding: 0,
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {!isCollapsed && (
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, color: "white" }}
          >
            CareerVest
          </Typography>
        )}
        <IconButton
          onClick={() => setIsCollapsed(!isCollapsed)}
          sx={{ color: "white" }}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      <Box sx={{ px: 2, py: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{ width: 40, height: 40, mr: isCollapsed ? 0 : 2 }}
            src={""}
          />
          {!isCollapsed && userData && (
            <Box>
              <Typography variant="subtitle1" noWrap sx={{ color: "white" }}>
                {userData.name || "User"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                noWrap
              >
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
            hasPermission = true;
          } else if (module in permissions) {
            const permissionType = permissions[module as keyof AppPermissions];
            hasPermission =
              permissionType?.[userRole]?.[item.permissionKey] === true;
          }

          if (hasPermission) {
            return (
              <ListItem key={item.title} disablePadding>
                <Tooltip
                  title={isCollapsed ? item.title : ""}
                  placement="right"
                >
                  <ListItemButton
                    component={Link}
                    href={item.path}
                    sx={{
                      minHeight: 48,
                      px: 2.5,
                      bgcolor:
                        isInterviewChainsActive &&
                        item.path === "/interview-chains"
                          ? "rgba(253, 197, 0, 0.2)"
                          : pathname === item.path
                          ? "rgba(253, 197, 0, 0.2)"
                          : "transparent",
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
                        color:
                          isInterviewChainsActive &&
                          item.path === "/interview-chains"
                            ? "#FDC500"
                            : pathname === item.path
                            ? "#FDC500"
                            : "white",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!isCollapsed && (
                      <ListItemText
                        primary={item.title}
                        sx={{
                          color:
                            isInterviewChainsActive &&
                            item.path === "/interview-chains"
                              ? "#FDC500"
                              : pathname === item.path
                              ? "#FDC500"
                              : "white",
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
              {!isCollapsed && (
                <ListItemText primary="Logout" sx={{ color: "white" }} />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Drawer>
  );
}
