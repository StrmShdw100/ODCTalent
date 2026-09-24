package com.odctalent.odctalent_backend.service;

import com.odctalent.odctalent_backend.dto.MissionRequest;
import com.odctalent.odctalent_backend.dto.MissionResponse;
import com.odctalent.odctalent_backend.entity.Mission;
import com.odctalent.odctalent_backend.entity.Recruteur;
import com.odctalent.odctalent_backend.entity.Utilisateur;
import com.odctalent.odctalent_backend.repository.MissionRepository;
import com.odctalent.odctalent_backend.repository.RecruteurRepository;
import com.odctalent.odctalent_backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MissionService {

    private final MissionRepository missionRepository;
    private final RecruteurRepository recruteurRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Transactional(readOnly = true)
    public List<MissionResponse> getAllMissions() {
        return missionRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public MissionResponse getMissionById(Long id) {
        Mission mission = missionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mission introuvable avec l'ID : " + id));
        return mapToResponse(mission);
    }

    @Transactional
    public MissionResponse createMission(String recruteurEmail, MissionRequest request) {
        Utilisateur user = utilisateurRepository.findByEmail(recruteurEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé."));

        Recruteur recruteur = recruteurRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Seul un recruteur peut publier une mission."));

        Mission mission = Mission.builder()
                .titre(request.getTitre())
                .description(request.getDescription())
                .budget(request.getBudget())
                .competencesRequises(request.getCompetencesRequises())
                .statut("DISPONIBLE")
                .datePublication(LocalDate.now())
                .recruteur(recruteur)
                .build();

        Mission saved = missionRepository.save(mission);
        return mapToResponse(saved);
    }

    private MissionResponse mapToResponse(Mission mission) {
        Recruteur r = mission.getRecruteur();
        return MissionResponse.builder()
                .id(mission.getId())
                .titre(mission.getTitre())
                .description(mission.getDescription())
                .budget(mission.getBudget())
                .competencesRequises(mission.getCompetencesRequises())
                .statut(mission.getStatut())
                .datePublication(mission.getDatePublication())
                .recruteurId(r != null ? r.getId() : null)
                .nomRecruteur(r != null ? r.getNom() : null)
                .prenomRecruteur(r != null ? r.getPrenom() : null)
                .emailRecruteur(r != null ? r.getEmail() : null)
                .build();
    }
}