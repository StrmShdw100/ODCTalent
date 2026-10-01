import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout';
import { DashboardComponent } from './features/dashboard/dashboard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'actualites', component: ActualitesComponent },
  { path: '**', redirectTo: 'login' }
];