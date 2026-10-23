package com.odctalent.odctalent_backend.service;

import com.odctalent.odctalent_backend.dto.DashboardStatsDTO;
import com.odctalent.odctalent_backend.entity.enums.Role;
import com.odctalent.odctalent_backend.repository.MissionRepository;
import com.odctalent.odctalent_backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UtilisateurRepository utilisateurRepository;
    private final MissionRepository missionRepository; // <-- Injection du repository des missions

    public DashboardStatsDTO getDashboardStats() {
        long totalApprenants = utilisateurRepository.countByRole(Role.APPRENANT);
        long totalRecruteurs = utilisateurRepository.countByRole(Role.RECRUTEUR);
        long totalAdministrateurs = utilisateurRepository.countByRole(Role.ADMIN);
        long comptesEnAttente = utilisateurRepository.findByActifFalse().size();
        
        long totalOpportunites = missionRepository.count(); 
        long totalCandidatures = 0; // Gardé à 0 en attendant le module candidatures

        return DashboardStatsDTO.builder()
                .totalApprenants(totalApprenants)
                .totalRecruteurs(totalRecruteurs)
                .totalOpportunites(totalOpportunites)
                .totalAdministrateurs(totalAdministrateurs)
                .comptesEnAttente(comptesEnAttente)
                .totalCandidatures(totalCandidatures)
                .recentActivities(new ArrayList<>())
                .build();
    }
}