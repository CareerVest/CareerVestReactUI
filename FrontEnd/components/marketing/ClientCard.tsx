"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import type { Client, Interview } from "@/types/marketing"

interface ClientCardProps {
  client: Client
  showOnlyToday: boolean
  showOnlyStatus?: "scheduled" | "completed"
  onInterviewClick: (interview: Interview) => void
}

export function ClientCard({ client, showOnlyToday, showOnlyStatus, onInterviewClick }: ClientCardProps) {
  const filteredInterviews = useMemo(() => {
    return client.interviews.filter((interview) => {
      if (showOnlyToday) {
        const today = new Date().toDateString()
        const interviewDate = new Date(interview.date).toDateString()
        if (today !== interviewDate) return false
      }
      if (showOnlyStatus && interview.status !== showOnlyStatus) return false
      return true
    })
  }, [client.interviews, showOnlyToday, showOnlyStatus])

  if (filteredInterviews.length === 0) return null

  return (
    <Collapsible defaultOpen className="w-full">
      <Card className="w-full border border-[#682A53]/10">
        <CardHeader className="p-3 pb-2">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold text-[#682A53]">{client.name}</CardTitle>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-[10px] px-1 h-5 border-[#682A53]/20">
                    S:{client.screeningCount}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] px-1 h-5 border-[#682A53]/20">
                    T:{client.technicalCount}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] px-1 h-5 border-[#682A53]/20">
                    F:{client.finalRoundCount}
                  </Badge>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-[#682A53]/70 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-3 pt-0">
            <div className="flex flex-wrap gap-2">
              {filteredInterviews.map((interview) => (
                <Card
                  key={interview.id}
                  className="flex-1 min-w-[250px] max-w-[300px] cursor-pointer hover:bg-[#682A53]/5 border border-[#682A53]/10"
                  onClick={() => onInterviewClick(interview)}
                >
                  <div className="p-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-[#682A53]">{interview.company}</p>
                          <p className="text-sm text-[#682A53]/70">{interview.tech}</p>
                        </div>
                        <Badge
                          variant={
                            interview.status === "completed"
                              ? "success"
                              : interview.status === "scheduled"
                                ? "default"
                                : "destructive"
                          }
                          className="text-xs px-2 h-6 bg-[#FDC500] text-[#682A53] flex-shrink-0"
                        >
                          {interview.type}
                        </Badge>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-[#682A53]/70">{interview.time}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

