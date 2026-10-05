import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout';
import { DashboardComponent } from './features/admin-dashboard/dashboard';
import { ActualitesComponent } from './features/actualites/actualites';
import { LoginComponent } from './features/auth/login/login.component';
import { ModerationComponent } from './features/moderation/moderation';
import { OpportunitesComponent } from './features/opportunites/opportunites';
import { ApprenantsComponent } from './features/admin-apprenants/apprenants';
import { ApprenantEvolutionComponent } from './features/apprenant-evolution/apprenant-evolution';
import { AdminRecruteursComponent } from './features/admin-recruteurs/admin-recruteurs';
import { AdminAdministrateursComponent } from './features/admin-administrateurs/admin-administrateurs';
import { AdminParametresComponent } from './features/admin-parametres/admin-parametres';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
    {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'actualites', component: ActualitesComponent },
      { path: 'moderation', component: ModerationComponent },
      { path: 'opportunites', component: OpportunitesComponent },
      { path: 'apprenants', component: ApprenantsComponent },
      { path: 'apprenants/evolution', component: ApprenantEvolutionComponent },
      { path: 'recruteurs', component: AdminRecruteursComponent },
      { path: 'administrateurs', component: AdminAdministrateursComponent },
      { path: 'parametres', component: AdminParametresComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // 2. Espace Recruteur (futur layout ou composant recruteur)
  // { path: 'recruteur/espace', component: RecruteurLayoutComponent },

  // 3. Espace Apprenant (futur layout ou composant apprenant)
  // { path: 'apprenant/espace', component: ApprenantDashboardComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];