export interface User {
  id: string;
  email: string;
  password?: string; // Optional for frontend use, included in DB
  name: string;
  role: 'student' | 'faculty' | 'admin';
  studentId?: string;
  department?: string;
  semester?: number;
  avatar?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  type: ActivityType;
  date: string;
  duration?: number;
  location?: string;
  organizer?: string;
  certificates?: string[];
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  points?: number;
  studentId: string;
  createdAt: string;
  updatedAt: string;
}

export type ActivityCategory = 
  | 'academic'
  | 'extracurricular'
  | 'research'
  | 'community-service'
  | 'leadership'
  | 'internship'
  | 'competition'
  | 'certification'
  | 'conference'
  | 'workshop';

export type ActivityType =
  | 'conference'
  | 'workshop'
  | 'seminar'
  | 'certification'
  | 'competition'
  | 'internship'
  | 'volunteer'
  | 'leadership'
  | 'research'
  | 'publication'
  | 'project'
  | 'course'
  | 'hackathon'
  | 'sports'
  | 'cultural'
  | 'technical';

export interface Portfolio {
  id: string;
  studentId: string;
  activities: Activity[];
  achievements: Achievement[];
  skills: Skill[];
  projects: Project[];
  template: 'modern' | 'classic' | 'minimal';
  isPublic: boolean;
  lastGenerated: string;
  downloadCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  issuer: string;
  certificateUrl?: string;
  category: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  verified: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  status: 'ongoing' | 'completed' | 'paused';
  githubUrl?: string;
  demoUrl?: string;
  images?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Analytics {
  totalActivities: number;
  approvedActivities: number;
  pendingActivities: number;
  rejectedActivities: number;
  totalPoints: number;
  categoryBreakdown: Record<ActivityCategory, number>;
  monthlyProgress: Array<{
    month: string;
    activities: number;
    points: number;
  }>;
  comparisonData: {
    departmentAverage: number;
    semesterAverage: number;
    rank: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  total?: number;
  page?: number;
  limit?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role: 'student' | 'faculty';
  studentId?: string;
  department: string;
  semester?: number;
}

export interface ActivityFormData {
  title: string;
  description: string;
  category: ActivityCategory;
  type: ActivityType;
  date: string;
  duration?: number;
  location?: string;
  organizer?: string;
  certificates?: FileList;
  images?: FileList;
}