import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ENVIRONMENT } from '@helpchat/shared';
import {
  AssignTicketRequest,
  Category,
  Comment,
  CreateCommentRequest,
  CreateTicketRequest,
  EscalateTicketRequest,
  Ticket,
  TicketListResponse,
  TicketStats,
  UpdateTicketRequest,
  UpdateTicketStatusRequest,
} from '@helpchat/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(ENVIRONMENT);

  private readonly baseUrl = `${this.environment.apiUri}/api/v1/tickets`;

  /**
   * Get all tickets with pagination and filtering
   */
  getTickets(
    page: number = 1,
    pageSize: number = 10,
    status?: string,
    priority?: string,
    categoryId?: string,
    assignedTo?: string
  ): Observable<TicketListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    if (status) params = params.set('status', status);
    if (priority) params = params.set('priority', priority);
    if (categoryId) params = params.set('category_id', categoryId);
    if (assignedTo) params = params.set('assigned_to', assignedTo);

    return this.http.get<TicketListResponse>(this.baseUrl, { params });
  }

  /**
   * Get a specific ticket by ID
   */
  getTicket(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new ticket
   */
  createTicket(ticketData: CreateTicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(this.baseUrl, ticketData);
  }

  /**
   * Update an existing ticket
   */
  updateTicket(
    id: string,
    ticketData: UpdateTicketRequest
  ): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.baseUrl}/${id}`, ticketData);
  }

  /**
   * Update ticket status
   */
  updateTicketStatus(
    id: string,
    statusData: UpdateTicketStatusRequest
  ): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.baseUrl}/${id}/status`, statusData);
  }

  /**
   * Assign ticket to an agent
   */
  assignTicket(
    id: string,
    assignData: AssignTicketRequest
  ): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.baseUrl}/${id}/assign`, assignData);
  }

  /**
   * Escalate a ticket
   */
  escalateTicket(
    id: string,
    escalateData: EscalateTicketRequest
  ): Observable<Ticket> {
    return this.http.patch<Ticket>(
      `${this.baseUrl}/${id}/escalate`,
      escalateData
    );
  }

  /**
   * Delete a ticket
   */
  deleteTicket(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get ticket statistics
   */
  getTicketStats(): Observable<TicketStats> {
    return this.http.get<TicketStats>(`${this.baseUrl}/stats`);
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${this.environment.apiUri}/api/v1/categories`
    );
  }

  /**
   * Get comments for a ticket
   */
  getTicketComments(ticketId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/${ticketId}/comments`);
  }

  /**
   * Add a comment to a ticket
   */
  addComment(
    ticketId: string,
    commentData: CreateCommentRequest
  ): Observable<Comment> {
    return this.http.post<Comment>(
      `${this.baseUrl}/${ticketId}/comments`,
      commentData
    );
  }

  /**
   * Update a comment
   */
  updateComment(
    ticketId: string,
    commentId: string,
    content: string
  ): Observable<Comment> {
    return this.http.put<Comment>(
      `${this.baseUrl}/${ticketId}/comments/${commentId}`,
      { content }
    );
  }

  /**
   * Delete a comment
   */
  deleteComment(ticketId: string, commentId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${ticketId}/comments/${commentId}`
    );
  }

  /**
   * Upload file attachment to a ticket
   */
  uploadAttachment(ticketId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/${ticketId}/attachments`, formData);
  }

  /**
   * Delete an attachment
   */
  deleteAttachment(ticketId: string, attachmentId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${ticketId}/attachments/${attachmentId}`
    );
  }
}
