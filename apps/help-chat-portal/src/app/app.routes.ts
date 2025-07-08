import { Route } from '@angular/router';
import { authGuard } from '@helpchat/services';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((c) => c.HomeComponent),
    // component: HomeComponent
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (c) => c.RegisterComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'tickets/create',
    loadComponent: () =>
      import('./pages/create-ticket/create-ticket.component').then(
        (c) => c.CreateTicketComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
