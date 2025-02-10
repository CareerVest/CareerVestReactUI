import type { Employee } from "../types/employee"

export const orgData: Employee = {
  id: "1",
  name: "John Doe",
  title: "CEO",
  department: "Executive",
  email: "john.doe@company.com",
  children: [
    {
      id: "2",
      name: "Alice Johnson",
      title: "Sales Manager",
      department: "Sales",
      email: "alice.johnson@company.com",
      children: [
        {
          id: "5",
          name: "Bob Wilson",
          title: "Sales Representative",
          department: "Sales",
          email: "bob.wilson@company.com",
        },
        {
          id: "6",
          name: "Carol Martinez",
          title: "Sales Representative",
          department: "Sales",
          email: "carol.martinez@company.com",
        },
      ],
    },
    {
      id: "3",
      name: "Eva Green",
      title: "Resume Department Manager",
      department: "Resume",
      email: "eva.green@company.com",
      children: [
        {
          id: "7",
          name: "David Lee",
          title: "Resume Specialist",
          department: "Resume",
          email: "david.lee@company.com",
        },
        {
          id: "8",
          name: "Emma Davis",
          title: "Resume Specialist",
          department: "Resume",
          email: "emma.davis@company.com",
        },
      ],
    },
    {
      id: "4",
      name: "Irene Wong",
      title: "Marketing Manager",
      department: "Marketing",
      email: "irene.wong@company.com",
      children: [
        {
          id: "9",
          name: "Jack Chen",
          title: "Recruiting Team Lead",
          department: "Marketing",
          email: "jack.chen@company.com",
          clients: [
            { id: "c1", name: "Client A", status: "Active" },
            { id: "c2", name: "Client B", status: "Interviewing" },
            { id: "c3", name: "Client C", status: "Placed" },
          ],
          children: [
            {
              id: "10",
              name: "Liam Wilson",
              title: "Recruiter",
              department: "Marketing",
              email: "liam.wilson@company.com",
              clients: [
                { id: "c4", name: "Client D", status: "Active" },
                { id: "c5", name: "Client E", status: "Interviewing" },
              ],
            },
            {
              id: "11",
              name: "Mia Taylor",
              title: "Recruiter",
              department: "Marketing",
              email: "mia.taylor@company.com",
              clients: [
                { id: "c6", name: "Client F", status: "Placed" },
                { id: "c7", name: "Client G", status: "Active" },
              ],
            },
          ],
        },
        {
          id: "14",
          name: "Sarah Brown",
          title: "Recruiting Team Lead",
          department: "Marketing",
          email: "sarah.brown@company.com",
          clients: [
            { id: "c8", name: "Client H", status: "Active" },
            { id: "c9", name: "Client I", status: "Interviewing" },
          ],
          children: [
            {
              id: "15",
              name: "Noah Brown",
              title: "Recruiter",
              department: "Marketing",
              email: "noah.brown@company.com",
              clients: [
                { id: "c10", name: "Client J", status: "Active" },
                { id: "c11", name: "Client K", status: "Interviewing" },
              ],
            },
            {
              id: "16",
              name: "Olivia Davis",
              title: "Recruiter",
              department: "Marketing",
              email: "olivia.davis@company.com",
              clients: [
                { id: "c12", name: "Client L", status: "Active" },
                { id: "c13", name: "Client M", status: "Placed" },
              ],
            },
          ],
        },
      ],
    },
  ],
}

// Helper function to get all recruiters and team leads
export function getAllRecruiters(data: Employee): Employee[] {
  const recruiters: Employee[] = []

  function traverse(node: Employee) {
    if (node.title === "Recruiter" || node.title === "Recruiting Team Lead") {
      recruiters.push(node)
    }
    if (node.children) {
      node.children.forEach(traverse)
    }
  }

  traverse(data)
  return recruiters
}

