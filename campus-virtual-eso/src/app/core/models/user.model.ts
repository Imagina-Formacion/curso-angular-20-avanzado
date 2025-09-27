export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  courses?: Course[];
}

export interface AuthUser extends User {
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  lastName: string;
  role: UserRole;
}

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

export interface Course {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  students: string[];
  subjects: Subject[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  courseId: string;
  teacherId: string;
  schedule: ClassSchedule[];
  assignments: Assignment[];
}

export interface ClassSchedule {
  id: string;
  subjectId: string;
  dayOfWeek: number; // 0-6 (Domingo-Sábado)
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  classroom: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  dueDate: Date;
  maxScore: number;
  attachments?: string[];
  submissions: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  attachments?: string[];
  score?: number;
  feedback?: string;
  submittedAt: Date;
  gradedAt?: Date;
}