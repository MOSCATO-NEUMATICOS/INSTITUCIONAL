
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
  link?: string; // Optional link to file (Base64 PDF)
  textContent?: string; // Optional full text content for online reading
}

export enum ManualCategory {
  ALL = 'Todos',
  TALLER = 'Taller', // Unifies Gomeria, Alineacion, Mecanica
  ADMINISTRACION = 'Administración',
  SEGURIDAD = 'Seguridad',
  VENTAS = 'Ventas'
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  highlight?: boolean;
  highlightDuration?: number; // Cantidad de días que permanece destacada (default 15)
  autoDelete?: boolean; // Si es true, se oculta/elimina automáticamente
  autoDeleteDuration?: number; // Días tras los cuales se elimina
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
  status?: FeedbackStatus; // Nuevo: Estado del ticket
  type?: FeedbackType;     // Nuevo: Tipo de mensaje
  priority?: FeedbackPriority; // Nuevo: Prioridad
  adminNotes?: string;     // Nuevo: Notas internas del admin
}

export interface VisitRecord {
  id: string;
  timestamp: number;
  dateString: string; // ISO date or readable date for easier grouping
  deviceInfo?: string; // Optional: for future use (mobile/desktop)
  ip?: string; // Public IP address of the visitor
}

export interface IpAlias {
  id: string;
  ip: string;
  name: string; // e.g., "Oficina Central", "Celular Juan"
}

export interface EmployeeCourse {
  id: string;
  employeeName: string;
  courseTitle: string;
  platform: string; // e.g., "Goodyear", "Udemy", "Interno"
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
  discountChain: string; // e.g. "35+10+5"
  margin: number; // e.g. 40
  marginBase?: 'cost' | 'list'; // Calculate from Cost or List Price
  addIva?: boolean; // New: If true, adds 21% to list price before discounts
}