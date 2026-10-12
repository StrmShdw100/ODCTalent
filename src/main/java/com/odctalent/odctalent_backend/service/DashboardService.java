package com.odctalent.odctalent_backend.service;

import com.odctalent.odctalent_backend.dto.DashboardStatsDTO;
import com.odctalent.odctalent_backend.entity.enums.Role;
import com.odctalent.odctalent_backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UtilisateurRepository utilisateurRepository;

    public DashboardStatsDTO getDashboardStats() {
        long nbApprenants = utilisateurRepository.countByRole(Role.APPRENANT);
        long nbRecruteurs = utilisateurRepository.countByRole(Role.RECRUTEUR);

        long nbProjetsAModerer = 5;
        long nbOpportunitesActives = 12;
        long nbNouvellesOpportunites = 3;

        List<DashboardStatsDTO.ActivityDTO> activities = new ArrayList<>();
        activities.add(new DashboardStatsDTO.ActivityDTO("Yaya Diarra a soumis un nouveau projet", "Il y a 12 minutes", "project"));
        activities.add(new DashboardStatsDTO.ActivityDTO("Orange Sénégal a publié une opportunité", "Il y a 1 heure", "opportunity"));
        activities.add(new DashboardStatsDTO.ActivityDTO("Modou Kane a mis à jour son profil", "Il y a 3 heures", "profile"));

        return DashboardStatsDTO.builder()
                .apprenants(nbApprenants)
                .recruteurs(nbRecruteurs)
                .projetsAModerer(nbProjetsAModerer)
                .opportunitesActives(nbOpportunitesActives)
                .nouvellesOpportunites(nbNouvellesOpportunites)
                .recentActivities(activities)
                .build();
    }
}