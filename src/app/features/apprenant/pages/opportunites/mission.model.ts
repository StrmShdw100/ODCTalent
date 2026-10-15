export interface MissionResponse {
  id: number;
  titre: string;
  description: string;
  budget: number;
  competencesRequises: string;
  statut: string;
  datePublication: string;
  dateLimite?: string;
  recruteurId: number;
  nomRecruteur: string;
  prenomRecruteur: string;
  emailRecruteur: string;
}