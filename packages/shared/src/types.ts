// Common types for Final Golf SaaS

export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'MANAGER' | 'CUSTOMER'
}

export interface Course {
  id: string
  name: string
  description: string
}

export interface Booking {
  id: string
  userId: string
  courseId: string
  date: Date
  startTime: string
  endTime: string
}