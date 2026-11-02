package com.odctalent.odctalent_backend.service;

import com.odctalent.odctalent_backend.dto.ModerationStatsDto;
import com.odctalent.odctalent_backend.dto.ProjetRequest;
import com.odctalent.odctalent_backend.dto.ProjetResponse;
import com.odctalent.odctalent_backend.entity.Apprenant;
import com.odctalent.odctalent_backend.entity.Portfolio;
import com.odctalent.odctalent_backend.entity.Projet;
import com.odctalent.odctalent_backend.entity.Utilisateur;
import com.odctalent.odctalent_backend.repository.ApprenantRepository;
import com.odctalent.odctalent_backend.repository.PortfolioRepository;
import com.odctalent.odctalent_backend.repository.ProjetRepository;
import com.odctalent.odctalent_backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjetService {

    private final ProjetRepository projetRepository;
    private final PortfolioRepository portfolioRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ApprenantRepository apprenantRepository;

    @Transactional(readOnly = true)
    public List<ProjetResponse> getProjetsByPortfolioId(Long portfolioId) {
        return projetRepository.findByPortfolioId(portfolioId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ProjetResponse addProjetToMyPortfolio(String email, ProjetRequest request) {
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email : " + email));

        Portfolio portfolio = portfolioRepository.findByApprenantId(user.getId())
                .orElseGet(() -> {
                    Apprenant apprenant = apprenantRepository.findById(user.getId())
                            .orElseThrow(() -> new RuntimeException("Profil Apprenant introuvable pour cet utilisateur."));
                    
                    Portfolio newPortfolio = Portfolio.builder()
                            .apprenant(apprenant)
                            .titreProfessionnel("Mon Portfolio")
                            .visibilite("PUBLIC")
                            .dateCreation(LocalDate.now().toString())
                            .build();
                    return portfolioRepository.save(newPortfolio);
                });

        Projet projet = Projet.builder()
                .titre(request.getTitre())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .githubUrl(request.getGithubUrl())
                .demoUrl(request.getDemoUrl())
                .technologies(request.getTechnologies())
                .dateCreation(LocalDate.now())
                .portfolio(portfolio)
                .estCollaboratif(request.getEstCollaboratif() != null ? request.getEstCollaboratif() : false)
                .nombrePersonnesRecherches(request.getNombrePersonnesRecherches())
                .competencesRequises(request.getCompetencesRequises())
                .statut("En attente")
                .build();

        Projet saved = projetRepository.save(projet);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteProjet(Long projetId, String email) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new RuntimeException("Projet introuvable avec l'ID : " + projetId));

        if (!projet.getPortfolio().getApprenant().getEmail().equals(email)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à supprimer ce projet.");
        }

        projetRepository.delete(projet);
    }

    @Transactional(readOnly = true)
    public ProjetResponse getProjetById(Long id) {
        Projet projet = projetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet introuvable avec l'ID : " + id));
        return mapToResponse(projet);
    }

    @Transactional
    public ProjetResponse updateProjet(Long projetId, String email, ProjetRequest request) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new RuntimeException("Projet introuvable avec l'ID : " + projetId));

        if (!projet.getPortfolio().getApprenant().getEmail().equals(email)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier ce projet.");
        }

        if (request.getTitre() != null) projet.setTitre(request.getTitre());
        if (request.getDescription() != null) projet.setDescription(request.getDescription());
        if (request.getImageUrl() != null) projet.setImageUrl(request.getImageUrl());
        if (request.getGithubUrl() != null) projet.setGithubUrl(request.getGithubUrl());
        if (request.getDemoUrl() != null) projet.setDemoUrl(request.getDemoUrl());
        if (request.getTechnologies() != null) projet.setTechnologies(request.getTechnologies());
        
        if (request.getEstCollaboratif() != null) projet.setEstCollaboratif(request.getEstCollaboratif());
        if (request.getNombrePersonnesRecherches() != null) projet.setNombrePersonnesRecherches(request.getNombrePersonnesRecherches());
        if (request.getCompetencesRequises() != null) projet.setCompetencesRequises(request.getCompetencesRequises());

        Projet updated = projetRepository.save(projet);
        return mapToResponse(updated);
    }

    // 🚀 Méthode pour valider tous les projets d'un coup
    @Transactional
    public void validerTousLesProjets() {
        List<Projet> projets = projetRepository.findAll();
        for (Projet projet : projets) {
            projet.setStatut("Validé");
        }
        projetRepository.saveAll(projets);
    }

    @Transactional(readOnly = true)
    public List<ProjetResponse> getProjetsByApprenantEmail(String email) {
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé."));
        return projetRepository.findByPortfolioApprenantId(user.getId()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProjetResponse> getAllProjets() {
        return projetRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ModerationStatsDto getModerationStats() {
        List<Projet> projets = projetRepository.findAll();
        long total = projets.size();
        
        long aModerer = projets.stream()
                .filter(p -> "En attente".equalsIgnoreCase(p.getStatut()) || p.getStatut() == null)
                .count();
                
        long valides = projets.stream()
                .filter(p -> "Validé".equalsIgnoreCase(p.getStatut()))
                .count();

        long aCorriger = projets.stream()
                .filter(p -> "À corriger".equalsIgnoreCase(p.getStatut()))
                .count();

        // 🚀 Calcul dynamique du temps moyen de traitement pour les projets modifiés
        // (En comparant la date de création et la date actuelle pour les projets déjà traités)
        double tempsMoyenHeures = projets.stream()
                .filter(p -> !"En attente".equalsIgnoreCase(p.getStatut()) && p.getStatut() != null && p.getDateCreation() != null)
                .mapToLong(p -> java.time.temporal.ChronoUnit.HOURS.between(p.getDateCreation().atStartOfDay(), java.time.LocalDateTime.now()))
                .average()
                .orElse(1.2);

        String tempsFormate = String.format(java.util.Locale.US, "%.1fh", tempsMoyenHeures);

        return ModerationStatsDto.builder()
                .total(total)
                .aExaminer(aModerer)
                .validesMois(valides)
                .refusesMois(aCorriger)
                .tempsTraitement(tempsFormate)
                .build();
    }


    @Transactional
    public ProjetResponse updateStatutProjet(Long id, String nouveauStatut) {
        Projet projet = projetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet introuvable avec l'ID : " + id));
        
        projet.setStatut(nouveauStatut);
        Projet updated = projetRepository.save(projet);
        return mapToResponse(updated);
    }

    private ProjetResponse mapToResponse(Projet projet) {
        Apprenant apprenant = projet.getPortfolio() != null ? projet.getPortfolio().getApprenant() : null;
        
        return ProjetResponse.builder()
                .id(projet.getId())
                .titre(projet.getTitre())
                .description(projet.getDescription())
                .imageUrl(projet.getImageUrl())
                .githubUrl(projet.getGithubUrl())
                .demoUrl(projet.getDemoUrl())
                .technologies(projet.getTechnologies())
                .dateCreation(projet.getDateCreation())
                .portfolioId(projet.getPortfolio() != null ? projet.getPortfolio().getId() : null)
                .estCollaboratif(projet.getEstCollaboratif())
                .nombrePersonnesRecherches(projet.getNombrePersonnesRecherches())
                .competencesRequises(projet.getCompetencesRequises())
                .nomCreateur(apprenant != null ? apprenant.getNom() : null)
                .prenomCreateur(apprenant != null ? apprenant.getPrenom() : null)
                .statut(projet.getStatut())
                .build();
    }
}