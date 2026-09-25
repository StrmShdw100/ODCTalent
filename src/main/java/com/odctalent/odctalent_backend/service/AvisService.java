package com.odctalent.odctalent_backend.service;

import com.odctalent.odctalent_backend.dto.AvisRequest;
import com.odctalent.odctalent_backend.dto.AvisResponse;
import com.odctalent.odctalent_backend.entity.Apprenant;
import com.odctalent.odctalent_backend.entity.Avis;
import com.odctalent.odctalent_backend.entity.Mission;
import com.odctalent.odctalent_backend.entity.Recruteur;
import com.odctalent.odctalent_backend.entity.Utilisateur;
import com.odctalent.odctalent_backend.repository.ApprenantRepository;
import com.odctalent.odctalent_backend.repository.AvisRepository;
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
public class AvisService {

    private final AvisRepository avisRepository;
    private final MissionRepository missionRepository;
    private final ApprenantRepository apprenantRepository;
    private final RecruteurRepository recruteurRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Transactional
    public AvisResponse creerAvis(String emailRecruteur, AvisRequest request) {
        Utilisateur user = utilisateurRepository.findByEmail(emailRecruteur)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));

        Recruteur recruteur = recruteurRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Seul un recruteur peut laisser un avis."));

        Mission mission = missionRepository.findById(request.getMissionId())
                .orElseThrow(() -> new RuntimeException("Mission introuvable."));

        // Vérifier que le recruteur connecté est bien celui qui a publié la mission
        if (!mission.getRecruteur().getId().equals(recruteur.getId())) {
            throw new RuntimeException("Vous n'êtes pas autorisé à laisser un avis pour cette mission.");
        }

        Apprenant apprenant = apprenantRepository.findById(request.getApprenantId())
                .orElseThrow(() -> new RuntimeException("Apprenant introuvable."));

        Avis avis = Avis.builder()
                .commentaire(request.getCommentaire())
                .dateAvis(LocalDate.now())
                .mission(mission)
                .recruteur(recruteur)
                .apprenant(apprenant)
                .build();

        Avis saved = avisRepository.save(avis);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AvisResponse> getAvisByApprenant(Long apprenantId) {
        return avisRepository.findByApprenantId(apprenantId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AvisResponse> getAvisByMission(Long missionId) {
        return avisRepository.findByMissionId(missionId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    private AvisResponse mapToResponse(Avis a) {
        Mission m = a.getMission();
        Recruteur r = a.getRecruteur();
        Apprenant ap = a.getApprenant();

        return AvisResponse.builder()
                .id(a.getId())
                .commentaire(a.getCommentaire())
                .dateAvis(a.getDateAvis())
                .missionId(m != null ? m.getId() : null)
                .titreMission(m != null ? m.getTitre() : null)
                .recruteurId(r != null ? r.getId() : null)
                .nomRecruteur(r != null ? r.getNom() : null)
                .apprenantId(ap != null ? ap.getId() : null)
                .nomApprenant(ap != null ? ap.getNom() : null)
                .prenomApprenant(ap != null ? ap.getPrenom() : null)
                .build();
    }
}