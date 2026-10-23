package com.odctalent.odctalent_backend.service;

import com.odctalent.odctalent_backend.dto.RecruiterStatsDto;
import com.odctalent.odctalent_backend.entity.Recruteur;
import com.odctalent.odctalent_backend.entity.Utilisateur;
import com.odctalent.odctalent_backend.repository.MissionRepository;
import com.odctalent.odctalent_backend.repository.RecruteurRepository;
import com.odctalent.odctalent_backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecruiterDashboardService {

    private final MissionRepository missionRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final RecruteurRepository recruteurRepository;

    @Transactional(readOnly = true)
    public RecruiterStatsDto getStats(String email) {
        // 1. Récupérer l'utilisateur connecté
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé."));

        // 2. Vérifier que c'est bien un recruteur
        Recruteur recruteur = recruteurRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Recruteur introuvable."));

        // 3. Calculer le nombre réel de missions publiées par ce recruteur
        long missionsPubliees = missionRepository.findByRecruteurId(recruteur.getId()).size();
        // 4. Pour les candidatures et contrats, on met 0 temporairement 
        // (tu pourras m'envoyer tes fichiers Candidature/Contrat pour les brancher ici)
        long candidaturesRecues = 6;
        long candidaturesEnCours = 6;
        long contratsActifs = 06;

        return RecruiterStatsDto.builder()
                .missionsPubliees(missionsPubliees)
                .candidaturesRecues(candidaturesRecues)
                .candidaturesEnCours(candidaturesEnCours)
                .contratsActifs(contratsActifs)
                .build();
    }
}