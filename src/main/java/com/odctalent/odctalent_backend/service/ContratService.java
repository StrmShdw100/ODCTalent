package com.odctalent.odctalent_backend.service;

import com.odctalent.odctalent_backend.entity.Candidature;
import com.odctalent.odctalent_backend.entity.Contrat;
import com.odctalent.odctalent_backend.entity.Recruteur;
import com.odctalent.odctalent_backend.entity.Utilisateur;
import com.odctalent.odctalent_backend.repository.CandidatureRepository;
import com.odctalent.odctalent_backend.repository.ContratRepository;
import com.odctalent.odctalent_backend.repository.RecruteurRepository;
import com.odctalent.odctalent_backend.dto.ContratResponse;
import com.odctalent.odctalent_backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContratService {

    private final ContratRepository contratRepository;
    private final CandidatureRepository candidatureRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final RecruteurRepository recruteurRepository;

    @Transactional(readOnly = true)
    public List<ContratResponse> getContratsForRecruteur(String emailRecruteur) {
        Utilisateur user = utilisateurRepository.findByEmail(emailRecruteur)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));

        Recruteur recruteur = recruteurRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Recruteur introuvable."));

        return contratRepository.findByCandidatureMissionRecruteurId(recruteur.getId()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ContratResponse creerContrat(String emailRecruteur, Long candidatureId, String termes) {
        Candidature candidature = candidatureRepository.findById(candidatureId)
                .orElseThrow(() -> new RuntimeException("Candidature introuvable avec l'ID : " + candidatureId));

        if (!candidature.getMission().getRecruteur().getEmail().equals(emailRecruteur)) {
            throw new RuntimeException("Non autorisé à créer un contrat pour cette candidature.");
        }

        Contrat contrat = Contrat.builder()
                .candidature(candidature)
                .termesEtConditions(termes)
                .statut("EN_ATTENTE_SIGNATURE")
                .build();

        Contrat saved = contratRepository.save(contrat);
        return mapToResponse(saved);
    }

    private ContratResponse mapToResponse(Contrat c) {
        var cand = c.getCandidature();
        var app = cand != null ? cand.getApprenant() : null;
        var miss = cand != null ? cand.getMission() : null;
        return ContratResponse.builder()
                .id(c.getId())
                .dateCreation(c.getDateCreation())
                .statut(c.getStatut())
                .termesEtConditions(c.getTermesEtConditions())
                .candidatureId(cand != null ? cand.getId() : null)
                .titreMission(miss != null ? miss.getTitre() : null)
                .nomCandidat(app != null ? app.getNom() : null)
                .prenomCandidat(app != null ? app.getPrenom() : null)
                .formationCandidat(app != null ? app.getFormation() : null)
                .build();
    }
}