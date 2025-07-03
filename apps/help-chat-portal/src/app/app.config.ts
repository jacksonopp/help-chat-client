import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { provideTheme } from "@helpchat/ui";
import { AuthInterceptor } from '@helpchat/services';
import { ENVIRONMENT } from '@helpchat/shared';
import { environment } from '../environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
    provideTheme(),
    {
      provide: ENVIRONMENT,
      useValue: environment
    }
  ],
};
