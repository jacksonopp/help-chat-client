import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '@helpchat/services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Welcome to HelpChat
          </h1>
          <p class="text-lg text-gray-600 mb-8">
            Your comprehensive help desk and support management system
          </p>
        </div>

        <p-card>
          <div class="text-center space-y-6">
            <div *ngIf="isAuthenticated; else notAuthenticated">
              <p class="text-gray-700 mb-4">
                Welcome back! You are currently logged in.
              </p>
              <p-button
                label="Go to Dashboard"
                (onClick)="goToDashboard()"
                styleClass="w-full"
              ></p-button>
            </div>

            <ng-template #notAuthenticated>
              <p class="text-gray-700 mb-4">
                Please sign in to access your dashboard and manage support tickets.
              </p>
              <p-button
                label="Sign In"
                (onClick)="goToLogin()"
                styleClass="w-full"
              ></p-button>
            </ng-template>
          </div>
        </p-card>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isAuthenticated = false;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
} 