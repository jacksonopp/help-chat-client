export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category_id: string;
  category?: Category;
  created_by_id: string;
  created_by?: User;
  assigned_agent_id?: string;
  assigned_agent?: User;
  due_date?: string;
  creation_time: string;
  expiration_time?: string;
  resolved_at?: string;
  escalated_at?: string;
  escalated_to?: string;
  escalated_to_user?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
  category_id?: string;
  due_date?: string;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  category_id?: string;
  due_date?: string;
}

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
}

export interface AssignTicketRequest {
  agent_id: string;
}

export interface EscalateTicketRequest {
  escalated_to: string;
  reason: string;
}

export interface TicketListResponse {
  tickets: Ticket[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface TicketStats {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  escalated_tickets: number;
  overdue_tickets: number;
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  parent_id?: string;
  parent?: Category;
  children?: Category[];
  created_at: string;
}

export interface Comment {
  id: string;
  content: string;
  is_internal: boolean;
  ticket_id: string;
  ticket?: Ticket;
  user_id: string;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentRequest {
  content: string;
  is_internal?: boolean;
}

export interface Attachment {
  id: string;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  is_safe: boolean;
  is_virus_scanned: boolean;
  ticket_id: string;
  ticket?: Ticket;
  uploaded_by_id: string;
  uploaded_by?: User;
  created_at: string;
}

// Import User and UserRole from auth module
import type { User } from './auth';
