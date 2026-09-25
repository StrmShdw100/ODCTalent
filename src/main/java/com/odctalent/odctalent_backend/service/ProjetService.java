package com.odctalent.odctalent_backend.service;

import com.odctalent.odctalent_backend.dto.ProjetRequest;
import com.odctalent.odctalent_backend.dto.ProjetResponse;
import com.odctalent.odctalent_backend.entity.Portfolio;
import com.odctalent.odctalent_backend.entity.Projet;
import com.odctalent.odctalent_backend.entity.Utilisateur;
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
                .orElseThrow(() -> new RuntimeException("Portfolio non trouvé. Veuillez d'abord initialiser votre portfolio."));

        Projet projet = Projet.builder()
                .titre(request.getTitre())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .githubUrl(request.getGithubUrl())
                .demoUrl(request.getDemoUrl())
                .technologies(request.getTechnologies())
                .dateCreation(LocalDate.now())
                .portfolio(portfolio)
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

        Projet updated = projetRepository.save(projet);
        return mapToResponse(updated);
    }

    private ProjetResponse mapToResponse(Projet projet) {
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
                .build();
    }
}