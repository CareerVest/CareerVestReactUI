"use client"

import { useState } from "react"
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
} from "@mui/material"
import {
  Speed,
  BusinessCenter,
  Group,
  TrendingUp,
  Chat,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExitToApp,
} from "@mui/icons-material"
import { BarChartIcon as OrganizationChart, DollarSign } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const menuItems = [
  { title: "Dashboard", icon: <Speed />, path: "/" },
  { title: "Clients", icon: <BusinessCenter />, path: "/clients" },
  { title: "Employees", icon: <Group />, path: "/employees" },
  { title: "Marketing Activity", icon: <TrendingUp />, path: "/marketing" },
  { title: "Interviews", icon: <Chat />, path: "/interviews" },
  { title: "Team Hierarchy", icon: <OrganizationChart />, path: "/supervisors" },
  { title: "Accounting", icon: <DollarSign />, path: "/accounting" },
  { title: "Settings", icon: <Settings />, path: "/settings" },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/login")
  }

  return (
    <Drawer
      variant="permanent"
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
          position: "fixed",
          height: "100vh",
          overflowX: "hidden",
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
          <Avatar sx={{ width: 40, height: 40, mr: isCollapsed ? 0 : 2 }} />
          {!isCollapsed && (
            <Box>
              <Typography variant="subtitle1" noWrap sx={{ color: "white" }}>
                Admin User
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }} noWrap>
                admin@careervest.com
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <List>
        {menuItems.map((item) => (
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
        ))}
        <ListItem disablePadding>
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
  )
}

