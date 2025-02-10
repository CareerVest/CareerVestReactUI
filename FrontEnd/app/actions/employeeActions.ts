import type { Employee, EmployeeFormData } from "../types/employee"

// This is a dummy implementation. In a real app, you would fetch this from your API or database.
const dummyEmployees: Employee[] = [
  {
    EmployeeID: 1,
    FirstName: "John",
    LastName: "Doe",
    PersonalEmailAddress: "john.doe@example.com",
    PersonalPhoneNumber: "+1234567890",
    PersonalPhoneCountryCode: "+1",
    CompanyEmailAddress: "john.doe@company.com",
    JoinedDate: "2023-01-15",
    Status: "Active",
    TerminatedDate: null,
    EmployeeReferenceID: "EMP001",
    CompanyComments: "Excellent performer",
    Role: "Manager",
    SupervisorID: null,
  },
  // Add more dummy employees here
]

export async function fetchEmployees(): Promise<Employee[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return dummyEmployees
}

export async function getEmployee(employeeId: number): Promise<Employee | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return dummyEmployees.find((employee) => employee.EmployeeID === employeeId) || null
}

export async function createEmployee(employeeData: EmployeeFormData): Promise<Employee> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const newEmployee: Employee = {
    EmployeeID: Math.max(...dummyEmployees.map((e) => e.EmployeeID)) + 1,
    ...employeeData,
  }
  dummyEmployees.push(newEmployee)
  return newEmployee
}

export async function updateEmployee(employeeId: number, employeeData: EmployeeFormData): Promise<Employee | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const index = dummyEmployees.findIndex((employee) => employee.EmployeeID === employeeId)
  if (index !== -1) {
    dummyEmployees[index] = { ...dummyEmployees[index], ...employeeData }
    return dummyEmployees[index]
  }
  return null
}

export async function deleteEmployee(employeeId: number): Promise<boolean> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const index = dummyEmployees.findIndex((employee) => employee.EmployeeID === employeeId)
  if (index !== -1) {
    dummyEmployees.splice(index, 1)
    return true
  }
  return false
}

