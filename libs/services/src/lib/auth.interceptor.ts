import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<any>(null);

export function AuthInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> {
  const authService = inject(AuthService);
  
  // Add withCredentials to all requests to include cookies
  request = request.clone({
    withCredentials: true
  });

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Don't attempt token refresh for authentication endpoints
      const isAuthEndpoint = request.url.includes('auth/login') || 
                            request.url.includes('auth/register') || 
                            request.url.includes('auth/forgot-password') ||
                            request.url.includes('auth/verify-email') ||
                            request.url.includes('auth/reset-password');
      
      if (error.status === 401 && !isAuthEndpoint && !request.url.includes('auth/refresh')) {
        return handle401Error(request, next, authService);
      }
      return throwError(() => error);
    })
  );
}

function handle401Error(request: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService): Observable<any> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap(() => {
        isRefreshing = false;
        refreshTokenSubject.next(true);
        return next(request);
      }),
      catchError((err) => {
        isRefreshing = false;
        refreshTokenSubject.next(null);
        // Only logout if we have a user (meaning they were previously authenticated)
        authService.currentUser$.pipe(take(1)).subscribe(user => {
          if (user) {
            authService.logout().subscribe();
          }
        });
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => next(request))
    );
  }
} 