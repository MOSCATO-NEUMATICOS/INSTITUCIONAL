
export enum Page {
  HOME = 'home',
  MANUALS = 'manuals',
  TOOLS = 'tools',
  METRICS = 'metrics',
  COURSES = 'courses',
  FEEDBACK = 'feedback',
  ADMIN = 'admin'
}

export interface Manual {
  id: string;
  title: string;
  category: ManualCategory;
  description: string;
  lastUpdated: string;
  link?: string;
  textContent?: string;
}

export enum ManualCategory {
  ALL = 'Todos',
  TALLER = 'Taller',
  ADMINISTRACION = 'Administración',
  SEGURIDAD = 'Seguridad',
  VENTAS = 'Ventas'
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  timestamp?: number;
  description: string;
  highlight?: boolean;
  highlightDuration?: number;
  autoDelete?: boolean;
  autoDeleteDuration?: number;
}

export type FeedbackStatus = 'new' | 'in_progress' | 'resolved';
export type FeedbackType = 'suggestion' | 'claim' | 'bug' | 'request' | 'other';
export type FeedbackPriority = 'normal' | 'high';

export interface FeedbackItem {
  id: string;
  date: string;
  timestamp: number;
  isAnonymous: boolean;
  name?: string;
  message: string;
  status?: FeedbackStatus;
  type?: FeedbackType;
  priority?: FeedbackPriority;
  adminNotes?: string;
}

export interface VisitRecord {
  id: string;
  timestamp: number;
  dateString: string;
  deviceInfo?: string;
  deviceId?: string;
  ip?: string;
  isp?: string;
  screenResolution?: string;
  language?: string;
  timezone?: string; // Nuevo
  sectionsVisited?: string[];
}

export interface IpAlias {
  id: string;
  ip: string;
  name: string;
}

export interface DeviceAlias { // Nuevo
  id: string;
  deviceId: string;
  name: string;
}

export interface EmployeeCourse {
  id: string;
  employeeName: string;
  courseTitle: string;
  platform: string;
  date: string;
  hasCertificate: boolean;
  timestamp: number;
}

export interface RecommendedCourse {
  id: string;
  title: string;
  platform: string;
  description: string;
  link: string;
}

export interface Supplier {
  id: string;
  name: string;
  discountChain: string;
  margin: number;
  marginBase?: 'cost' | 'list';
  addIva?: boolean;
}
