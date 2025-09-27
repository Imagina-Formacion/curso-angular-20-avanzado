import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Zone.js change detection
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router with initial navigation
    provideRouter(routes, withEnabledBlockingInitialNavigation()),

    // HTTP Client with interceptors
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
