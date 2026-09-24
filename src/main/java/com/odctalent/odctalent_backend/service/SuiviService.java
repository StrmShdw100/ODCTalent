package com.odctalent.odctalent_backend.service;

import com.odctalent.odctalent_backend.dto.EvolutionRequest;
import com.odctalent.odctalent_backend.dto.EvolutionResponse;
import com.odctalent.odctalent_backend.entity.Apprenant;
import com.odctalent.odctalent_backend.entity.EvolutionProfessionnelle;
import com.odctalent.odctalent_backend.repository.ApprenantRepository;
import com.odctalent.odctalent_backend.repository.EvolutionProfessionnelleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SuiviService {

    private final EvolutionProfessionnelleRepository evolutionRepository;
    private final ApprenantRepository apprenantRepository;

    // ==================== ESPACE ADMIN ODC ====================

    @Transactional
    public EvolutionResponse ajouterEvolution(EvolutionRequest request) {
        Apprenant apprenant = apprenantRepository.findById(request.getApprenantId())
                .orElseThrow(() -> new RuntimeException("Apprenant introuvable avec l'ID : " + request.getApprenantId()));

        EvolutionProfessionnelle evolution = mapToEntity(request, apprenant);
        return mapToResponse(evolutionRepository.save(evolution));
    }

    @Transactional(readOnly = true)
    public List<EvolutionResponse> getHistoriqueApprenant(Long apprenantId) {
        return evolutionRepository.findByApprenantIdOrderByDateDebutDesc(apprenantId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==================== ESPACE APPRENANT CONNECTÉ (/me) ====================

    @Transactional
    public EvolutionResponse ajouterEvolutionPourApprenantConnecte(EvolutionRequest request, String email) {
        Apprenant apprenant = apprenantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Apprenant introuvable avec l'email : " + email));

        EvolutionProfessionnelle evolution = mapToEntity(request, apprenant);
        // L'apprenant ne renseigne pas la remarque réservée à l'administration
        evolution.setRemarquesAdmin(null); 

        return mapToResponse(evolutionRepository.save(evolution));
    }

    @Transactional(readOnly = true)
    public List<EvolutionResponse> getHistoriqueApprenantConnecte(String email) {
        Apprenant apprenant = apprenantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Apprenant introuvable avec l'email : " + email));

        return evolutionRepository.findByApprenantIdOrderByDateDebutDesc(apprenant.getId()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==================== METHODES DE MAPPING ====================

    private EvolutionProfessionnelle mapToEntity(EvolutionRequest request, Apprenant apprenant) {
        return EvolutionProfessionnelle.builder()
                .poste(request.getPoste())
                .entreprise(request.getEntreprise())
                .statutEmploi(request.getStatutEmploi())
                .localisation(request.getLocalisation())
                .dateDebut(request.getDateDebut())
                .dateFin(request.getDateFin())
                .remarquesAdmin(request.getRemarquesAdmin())
                .apprenant(apprenant)
                .build();
    }

    private EvolutionResponse mapToResponse(EvolutionProfessionnelle entity) {
        return EvolutionResponse.builder()
                .id(entity.getId())
                .poste(entity.getPoste())
                .entreprise(entity.getEntreprise())
                .statutEmploi(entity.getStatutEmploi())
                .localisation(entity.getLocalisation())
                .dateDebut(entity.getDateDebut())
                .dateFin(entity.getDateFin())
                .remarquesAdmin(entity.getRemarquesAdmin())
                .apprenantId(entity.getApprenant().getId())
                .nomApprenant(entity.getApprenant().getNom() + " " + entity.getApprenant().getPrenom())
                .build();
    }
}