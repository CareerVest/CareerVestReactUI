import { Card, CardContent, Typography, Box, type SxProps, type Theme } from "@mui/material"
import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  sx?: SxProps<Theme>
}

export function StatCard({ title, value, icon, trend, sx }: StatCardProps) {
  return (
    <Card sx={{ height: "100%", ...sx }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography color="text.secondary" variant="subtitle2">
            {title}
          </Typography>
          <Box sx={{ color: "primary.main" }}>{icon}</Box>
        </Box>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          {value}
        </Typography>
        {trend && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: trend.isPositive ? "success.main" : "error.main",
            }}
          >
            <Typography variant="body2" component="span">
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

