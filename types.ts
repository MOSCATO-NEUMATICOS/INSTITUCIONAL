
export enum Page {
  HOME = 'home',
  MANUALS = 'manuals',
  TOOLS = 'tools',
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
}

export interface FeedbackItem {
  id: string;
  date: string;
  timestamp: number;
  isAnonymous: boolean;
  name?: string;
  message: string;
}
