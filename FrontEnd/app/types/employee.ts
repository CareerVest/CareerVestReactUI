export interface Client {
  id: string
  name: string
  status: string
}

export interface Employee {
  id: string
  name: string
  title: string
  department: string
  email: string
  children?: Employee[]
  clients?: Client[]
}

