"use client"

import { useState, type React } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Employee } from "@/types/employee"

interface OrgChartProps {
  data: Employee
  onEmployeeClick: (employee: Employee) => void
}

const departmentColors = {
  Executive: "border-l-[#682A53]",
  Sales: "border-l-[#22C55E]",
  Resume: "border-l-[#0EA5E9]",
  Marketing: "border-l-[#F59E0B]",
}

const departmentBadgeColors = {
  Executive: "bg-[#682A53] text-white",
  Sales: "bg-[#22C55E] text-white",
  Resume: "bg-[#0EA5E9] text-white",
  Marketing: "bg-[#F59E0B] text-white",
}

const EmployeeNode = ({
  employee,
  level = 0,
  isExpanded,
  isSelected,
  onToggle,
  onEmployeeClick,
}: {
  employee: Employee
  level: number
  isExpanded: boolean
  isSelected: boolean
  onToggle: (e: React.MouseEvent) => void
  onEmployeeClick: (employee: Employee) => void
}) => {
  const hasChildren = employee.children && employee.children.length > 0
  const isManager = employee.title.includes("Manager")
  const isTeamLead = employee.title.includes("Team Lead")
  const isCEO = employee.title === "CEO"

  return (
    <div className={cn("relative pl-6 border-l-2", departmentColors[employee.department], level > 0 && "ml-8")}>
      <div
        className={cn(
          "py-2 px-2 rounded-lg transition-colors duration-200 cursor-pointer",
          isSelected ? "bg-[#682A53]/10" : "hover:bg-gray-100",
        )}
        onClick={(e) => {
          onToggle(e)
          onEmployeeClick(employee)
        }}
      >
        <div className="flex items-center justify-between group">
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{employee.name}</div>
            <div className="text-sm text-gray-500">{employee.title}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("px-2 py-1 text-xs rounded-full", departmentBadgeColors[employee.department])}>
              {employee.department}
            </span>
            {hasChildren && (
              <div className={cn("p-1 rounded-full", (isCEO || isManager || isTeamLead) && "bg-gray-100")}>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrgChart({ data, onEmployeeClick }: OrgChartProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([data.id]))
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const findParentNode = (nodeId: string, tree: Employee): Employee | null => {
    if (tree.children) {
      for (const child of tree.children) {
        if (child.id === nodeId) return tree
        const found = findParentNode(nodeId, child)
        if (found) return found
      }
    }
    return null
  }

  const toggleNode = (node: Employee, e: React.MouseEvent) => {
    e.stopPropagation()

    setExpandedNodes((prev) => {
      const next = new Set(prev)
      const isCEO = node.title === "CEO"
      const isManager = node.title.includes("Manager")
      const isTeamLead = node.title.includes("Team Lead")

      if (isCEO) {
        // If CEO is clicked, toggle between showing only CEO and showing first level
        if (next.has(node.id)) {
          next.clear()
        } else {
          next.clear()
          next.add(node.id)
        }
      } else if (isManager) {
        // If a manager is clicked, collapse other departments
        const departments = data.children || []
        departments.forEach((dept) => {
          if (dept.id !== node.id) {
            next.delete(dept.id)
            // Also collapse all children of other departments
            const stack = [...(dept.children || [])]
            while (stack.length) {
              const current = stack.pop()!
              next.delete(current.id)
              if (current.children) stack.push(...current.children)
            }
          }
        })
        // Toggle the clicked department
        if (next.has(node.id)) {
          next.delete(node.id)
          // Also collapse all children
          const stack = [...(node.children || [])]
          while (stack.length) {
            const current = stack.pop()!
            next.delete(current.id)
            if (current.children) stack.push(...current.children)
          }
        } else {
          next.add(node.id)
        }
      } else if (isTeamLead) {
        // If a team lead is clicked, collapse other departments and other team leads
        const departments = data.children || []
        departments.forEach((dept) => {
          if (dept.department !== node.department) {
            next.delete(dept.id)
            // Collapse all children of other departments
            const stack = [...(dept.children || [])]
            while (stack.length) {
              const current = stack.pop()!
              next.delete(current.id)
              if (current.children) stack.push(...current.children)
            }
          } else {
            // For the same department, keep it expanded but collapse other team leads
            next.add(dept.id)
            const teamLeads = dept.children || []
            teamLeads.forEach((teamLead) => {
              if (teamLead.id !== node.id) {
                next.delete(teamLead.id)
                // Collapse all children of other team leads
                const stack = [...(teamLead.children || [])]
                while (stack.length) {
                  const current = stack.pop()!
                  next.delete(current.id)
                  if (current.children) stack.push(...current.children)
                }
              }
            })
          }
        })
        // Toggle the clicked team lead
        if (next.has(node.id)) {
          next.delete(node.id)
          // Also collapse all children
          const stack = [...(node.children || [])]
          while (stack.length) {
            const current = stack.pop()!
            next.delete(current.id)
            if (current.children) stack.push(...current.children)
          }
        } else {
          next.add(node.id)
        }
      } else {
        // For regular nodes, just toggle them
        if (next.has(node.id)) {
          next.delete(node.id)
        } else {
          next.add(node.id)
        }
      }

      // Always keep the path to the expanded nodes open
      let current = node
      while (current) {
        next.add(current.id)
        const parent = findParentNode(current.id, data)
        if (!parent || parent.id === current.id) break
        current = parent
      }

      return next
    })

    setSelectedNode(selectedNode === node.id ? null : node.id)
    onEmployeeClick(node)
  }

  const renderNode = (node: Employee, level = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const isSelected = selectedNode === node.id

    return (
      <div key={node.id}>
        <EmployeeNode
          employee={node}
          level={level}
          isExpanded={isExpanded}
          isSelected={isSelected}
          onToggle={(e) => toggleNode(node, e)}
          onEmployeeClick={onEmployeeClick}
        />
        {isExpanded && node.children && (
          <div className="ml-4">{node.children.map((child) => renderNode(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 shadow-lg border border-gray-200">{renderNode(data)}</div>
  )
}

