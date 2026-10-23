import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layout/admin-layout/admin-layout';
import { LoginComponent } from './features/admin/pages/admin-auth/login/login.component';
import { AdminDashboardComponent } from './features/admin/pages/admin-dashboard/dashboard';
import { ActualitesComponent } from './features/admin/pages/admin-actualites/actualites';
import { AdminAdministrateursComponent } from './features/admin/pages/admin-administrateurs/admin-administrateurs';
import { ApprenantEvolutionComponent } from './features/admin/pages/admin-apprenant-evolution/apprenant-evolution';
import { ApprenantsComponent } from './features/admin/pages/admin-apprenants/apprenants';
import { ModerationComponent } from './features/admin/pages/admin-moderation/moderation';
import { OpportunitesComponent } from './features/admin/pages/admin-opportunites/opportunites';
import { AdminParametresComponent } from './features/admin/pages/admin-parametres/admin-parametres';
import { AdminRecruteursComponent } from './features/admin/pages/admin-recruteurs/admin-recruteurs';
import { AdminNotificationsComponent } from './features/admin/pages/admin-notifications/admin-notifications';

import { RecruiterLayout } from './layout/recruiter-layout/recruiter-layout';
import { Bienvenue as BienvenueRecruteur } from './features/recruiter/pages/bienvenue/bienvenue';
import { Inscription as InscriptionRecruteur } from './features/recruiter/pages/inscription/inscription';
import { Entreprise } from './features/recruiter/pages/entreprise/entreprise';
import { EnAttente } from './features/recruiter/pages/en-attente/en-attente';
import { CompteValide } from './features/recruiter/pages/compte-valide/compte-valide';
import { TableauDeBord as TableauDeBordRecruteur } from './features/recruiter/pages/tableau-de-bord/tableau-de-bord';
import { Missions } from './features/recruiter/pages/missions-liste/missions';
import { Candidatures } from './features/recruiter/pages/candidature/candidature';
import { CandidatureDetail } from './features/recruiter/pages/candidature-detail/candidature-detail';
import { Contrats } from './features/recruiter/pages/contrats/contrats';
import { Parametres as ParametresRecruteur } from './features/recruiter/pages/parametres/parametres';

import { Inscription as InscriptionApprenant } from './features/apprenant/pages/inscription/inscription';
import { InscriptionCompetences } from './features/apprenant/pages/inscription-competences/inscription-competences';
import { TableauDeBordApprenant } from './features/apprenant/pages/tableau-de-bord/tableau-de-bord';
import { NotificationsApprenant } from './features/apprenant/pages/notifications/notifications';
import { PortfolioSuccesApprenant } from './features/apprenant/pages/portfolio-succes/portfolio-succes';
import { PortfolioApprenant } from './features/apprenant/pages/portfolio/portfolio';
import { ApprenantLayout } from './layout/apprenant-layout/apprenant-layout';
import { RecruteurNotifications } from './features/recruiter/pages/notifications/recruteur-notifications';
import { ActualitesComponent as ActualitesApprenant } from './features/admin/pages/admin-actualites/actualites';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'actualites', component: ActualitesComponent },
      { path: 'moderation', component: ModerationComponent },
      { path: 'opportunites', component: OpportunitesComponent },
      { path: 'apprenants', component: ApprenantsComponent },
      { path: 'apprenants/evolution', component: ApprenantEvolutionComponent },
      { path: 'recruteurs', component: AdminRecruteursComponent },
      { path: 'administrateurs', component: AdminAdministrateursComponent },
      { path: 'parametres', component: AdminParametresComponent },
      { path: 'notifications', component: AdminNotificationsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: 'recruteur/bienvenue', component: BienvenueRecruteur },
  { path: 'recruteur/inscription', component: InscriptionRecruteur },
  { path: 'recruteur/entreprise', component: Entreprise },
  { path: 'recruteur/en-attente', component: EnAttente },
  { path: 'recruteur/compte-valide', component: CompteValide },

  {
    path: 'recruteur',
    component: RecruiterLayout,
    children: [
      { path: 'tableau-de-bord', component: TableauDeBordRecruteur },
      { path: 'missions', component: Missions },
      { path: 'candidatures', component: Candidatures },
      { path: 'candidatures/detail', component: CandidatureDetail },
      { path: 'contrats', component: Contrats },
      { path: 'parametres', component: ParametresRecruteur },
      { path: 'notifications', component: RecruteurNotifications }, 
      { path: '', redirectTo: 'tableau-de-bord', pathMatch: 'full' }
    ]
  },

  { path: 'apprenant/inscription', component: InscriptionApprenant },
  { path: 'apprenant/inscription-competences', component: InscriptionCompetences },
  { path: 'apprenant/portfolio-succes', component: PortfolioSuccesApprenant },
  {
    path: 'apprenant',
    component: ApprenantLayout,
    children: [
      { path: 'tableau-de-bord', component: TableauDeBordApprenant },
      { path: 'actualites', component: ActualitesApprenant }, 
      { path: 'notifications', component: NotificationsApprenant },
      { path: 'portfolio', component: PortfolioApprenant },
      { path: '', redirectTo: 'tableau-de-bord', pathMatch: 'full' }
    ]
  },

  { path: '', redirectTo: 'recruteur/inscription', pathMatch: 'full' },
  { path: '**', redirectTo: 'recruteur/inscription' }
];