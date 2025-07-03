import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ENVIRONMENT } from '@helpchat/shared';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyEmailRequest,
  AuthResponse,
  User,
  SuccessResponse,
  ErrorResponse
} from '@helpchat/types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(ENVIRONMENT);
  
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is already logged in (e.g., from localStorage or cookies)
    this.checkAuthStatus();
  }

  /**
   * Login user with email and password
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.environment.apiUri}/api/v1/auth/login`,
      credentials,
      { withCredentials: true } // Important for cookies
    ).pipe(
      tap(response => {
        this.currentUserSubject.next(response.user);
        this.storeUserData(response.user);
      })
    );
  }

  /**
   * Register a new user
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.environment.apiUri}/api/v1/auth/register`,
      userData,
      { withCredentials: true }
    ).pipe(
      tap(response => {
        this.currentUserSubject.next(response.user);
        this.storeUserData(response.user);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(
      `${this.environment.apiUri}/api/v1/auth/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
        this.clearUserData();
      })
    );
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(
      `${this.environment.apiUri}/api/v1/auth/refresh`,
      {},
      { withCredentials: true }
    );
  }

  /**
   * Request password reset
   */
  forgotPassword(request: ForgotPasswordRequest): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(
      `${this.environment.apiUri}/api/v1/auth/forgot-password`,
      request
    );
  }

  /**
   * Verify email with token
   */
  verifyEmail(request: VerifyEmailRequest): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(
      `${this.environment.apiUri}/api/v1/auth/verify-email`,
      request
    );
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('ADMINISTRATOR');
  }

  /**
   * Check if user is support agent
   */
  isSupportAgent(): boolean {
    return this.hasRole('SUPPORT_AGENT') || this.hasRole('ADMINISTRATOR') || this.hasRole('MANAGER');
  }

  /**
   * Store user data in localStorage
   */
  private storeUserData(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Clear user data from localStorage
   */
  private clearUserData(): void {
    localStorage.removeItem('currentUser');
  }

  /**
   * Check authentication status on app startup
   */
  private checkAuthStatus(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearUserData();
      }
    }
  }
} 