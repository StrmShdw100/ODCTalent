package com.odctalent.odctalent_backend.service;

import com.odctalent.odctalent_backend.dto.CandidatureRequest;
import com.odctalent.odctalent_backend.dto.CandidatureResponse;
import com.odctalent.odctalent_backend.entity.Apprenant;
import com.odctalent.odctalent_backend.entity.Candidature;
import com.odctalent.odctalent_backend.entity.Mission;
import com.odctalent.odctalent_backend.entity.Recruteur; 
import com.odctalent.odctalent_backend.entity.Utilisateur;
import com.odctalent.odctalent_backend.repository.ApprenantRepository;
import com.odctalent.odctalent_backend.repository.CandidatureRepository;
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
public class CandidatureService {

    private final CandidatureRepository candidatureRepository;
    private final MissionRepository missionRepository;
    private final ApprenantRepository apprenantRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final RecruteurRepository recruteurRepository; 
    private final EmailService emailService;
    private final NotificationService notificationService; 
    @Transactional
    public CandidatureResponse postuler(String emailApprenant, CandidatureRequest request) {
        Utilisateur user = utilisateurRepository.findByEmail(emailApprenant)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));

        Apprenant apprenant = apprenantRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Seul un apprenant peut postuler à une mission."));

        Mission mission = missionRepository.findById(request.getMissionId())
                .orElseThrow(() -> new RuntimeException("Mission introuvable."));

        if (candidatureRepository.findByMissionIdAndApprenantId(mission.getId(), apprenant.getId()).isPresent()) {
            throw new RuntimeException("Vous avez déjà postulé à cette mission.");
        }

        Candidature candidature = Candidature.builder()
                .lettreMotivation(request.getLettreMotivation())
                .tarifPropose(request.getTarifPropose())
                .statut("EN_ATTENTE")
                .dateCandidature(LocalDate.now())
                .mission(mission)
                .apprenant(apprenant)
                .build();

        Candidature saved = candidatureRepository.save(candidature);

        boolean isFreelance = mission.getBudget() != null && mission.getBudget() > 0;
        String typeOffreLibelle = isFreelance ? "Freelance & Missions" : "Recrutement & Stages";

        String titreNotif = "Candidature envoyée avec succès 🎯";
        String messageNotif = String.format("Vous avez postulé à l'offre '%s' (Type : %s). Le recruteur examine votre dossier.", 
                mission.getTitre(), typeOffreLibelle);

        notificationService.envoyerNotification(
                apprenant.getId(),
                titreNotif,
                messageNotif,
                "CANDIDATURE",
                saved.getId()
        );

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CandidatureResponse> getCandidaturesByMission(Long missionId) {
        return candidatureRepository.findByMissionId(missionId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CandidatureResponse> getCandidaturesForRecruteur(String emailRecruteur) {
        Utilisateur user = utilisateurRepository.findByEmail(emailRecruteur)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));

        Recruteur recruteur = recruteurRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Recruteur introuvable."));

        return candidatureRepository.findByMissionRecruteurId(recruteur.getId()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CandidatureResponse> getMyCandidatures(String emailApprenant) {
        Utilisateur user = utilisateurRepository.findByEmail(emailApprenant)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));

        return candidatureRepository.findByApprenantId(user.getId()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public CandidatureResponse updateStatutCandidature(Long candidatureId, String recruteurEmail, String nouveauStatut) {
        Candidature candidature = candidatureRepository.findById(candidatureId)
                .orElseThrow(() -> new RuntimeException("Candidature introuvable avec l'ID : " + candidatureId));

        if (!candidature.getMission().getRecruteur().getEmail().equals(recruteurEmail)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier le statut de cette candidature.");
        }

        candidature.setStatut(nouveauStatut);
        Candidature updated = candidatureRepository.save(candidature);

        if (updated.getApprenant() != null && updated.getMission() != null) {
            emailService.sendCandidatureStatusEmail(
                    updated.getApprenant().getEmail(),
                    updated.getMission().getTitre(),
                    nouveauStatut,
                    updated.getApprenant().getPrenom()
            );

            // 🚀 Optionnel : Notifier aussi l'apprenant du changement de statut de sa candidature
            String statutLibelle = "ACCEPTEE".equals(nouveauStatut) ? "Acceptée 🎉" : ("REFUSEE".equals(nouveauStatut) ? "Refusée ❌" : nouveauStatut);
            notificationService.envoyerNotification(
                    updated.getApprenant().getId(),
                    "Mise à jour de candidature",
                    String.format("Votre candidature pour l'offre '%s' est maintenant : %s", updated.getMission().getTitre(), statutLibelle),
                    "STATUT_CANDIDATURE",
                    updated.getId()
            );
        }

        return mapToResponse(updated);
    }

    private CandidatureResponse mapToResponse(Candidature c) {
        return CandidatureResponse.builder()
                .id(c.getId())
                .lettreMotivation(c.getLettreMotivation())
                .tarifPropose(c.getTarifPropose())
                .statut(c.getStatut())
                .dateCandidature(c.getDateCandidature())
                .missionId(c.getMission() != null ? c.getMission().getId() : null)
                .titreMission(c.getMission() != null ? c.getMission().getTitre() : null)
                .apprenantId(c.getApprenant() != null ? c.getApprenant().getId() : null)
                .nomApprenant(c.getApprenant() != null ? c.getApprenant().getNom() : null)
                .prenomApprenant(c.getApprenant() != null ? c.getApprenant().getPrenom() : null)
                .emailApprenant(c.getApprenant() != null ? c.getApprenant().getEmail() : null)
                .build();
    }
}