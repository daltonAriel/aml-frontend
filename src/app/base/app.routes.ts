import { provideHttpClient, withInterceptors } from '@angular/common/http';
import type { Routes } from '@angular/router';
import { adminHttpInterceptor } from '../admin/services/admin-http-interceptor';
import { AdminSessionService } from '../admin/services/admin-session-service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../admin/modules/login/admin-login').then((c) => c.Login),
    providers: [provideHttpClient()],
  },
  {
    path: 'admin-dashboard',

    loadComponent: () =>
      import('../admin/modules/base/admin-base-layout').then((c) => c.AdminBaseLayout),
    providers: [AdminSessionService, provideHttpClient(withInterceptors([adminHttpInterceptor]))],
    loadChildren: () => import('../admin/admin.routes').then((r) => r.adminRoutes),
  },
];
