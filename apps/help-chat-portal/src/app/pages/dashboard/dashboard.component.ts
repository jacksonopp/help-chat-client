import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@helpchat/services';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, AvatarModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p-button
              label="Logout"
              severity="secondary"
              (onClick)="logout()"
            ></p-button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <p-card header="Welcome">
              <div class="flex items-center space-x-4">
                <p-avatar
                  [label]="userInitials"
                  size="large"
                  shape="circle"
                ></p-avatar>
                <div>
                  <h3 class="text-lg font-semibold">
                    {{ currentUser?.first_name }} {{ currentUser?.last_name }}
                  </h3>
                  <p class="text-gray-600">{{ currentUser?.email }}</p>
                  <p class="text-sm text-gray-500">
                    Role: {{ currentUser?.role }}
                  </p>
                </div>
              </div>
            </p-card>

            <p-card header="Account Status">
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span>Status:</span>
                  <span
                    [class]="
                      currentUser?.is_active ? 'text-green-600' : 'text-red-600'
                    "
                  >
                    {{ currentUser?.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span>Verified:</span>
                  <span
                    [class]="
                      currentUser?.is_verified
                        ? 'text-green-600'
                        : 'text-red-600'
                    "
                  >
                    {{ currentUser?.is_verified ? 'Yes' : 'No' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span>Last Login:</span>
                  <span>{{ lastLoginDate }}</span>
                </div>
              </div>
            </p-card>

            <p-card header="Quick Actions">
              <div class="space-y-3">
                <p-button
                  label="Create Ticket"
                  styleClass="w-full"
                  severity="primary"
                  (onClick)="goToCreateTicket()"
                ></p-button>
                <p-button
                  label="View Profile"
                  styleClass="w-full"
                  severity="secondary"
                ></p-button>
                <p-button
                  label="Change Password"
                  styleClass="w-full"
                  severity="secondary"
                ></p-button>
              </div>
            </p-card>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  currentUser = this.authService.getCurrentUser();

  get userInitials(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.first_name.charAt(
      0
    )}${this.currentUser.last_name.charAt(0)}`.toUpperCase();
  }

  get lastLoginDate(): string {
    if (!this.currentUser?.last_login_at) return 'Never';
    return new Date(this.currentUser.last_login_at).toLocaleDateString();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Still navigate to login even if logout fails
        this.router.navigate(['/login']);
      },
    });
  }

  goToCreateTicket() {
    this.router.navigate(['/tickets/create']);
  }
}
