package com.odctalent.odctalent_backend.service;

import com.odctalent.odctalent_backend.dto.PortfolioResponse;
import com.odctalent.odctalent_backend.dto.PortfolioUpdateRequest;
import com.odctalent.odctalent_backend.entity.Apprenant;
import com.odctalent.odctalent_backend.entity.Portfolio;
import com.odctalent.odctalent_backend.entity.Utilisateur;
import com.odctalent.odctalent_backend.repository.ApprenantRepository;
import com.odctalent.odctalent_backend.repository.PortfolioRepository;
import com.odctalent.odctalent_backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ApprenantRepository apprenantRepository;

    @Transactional(readOnly = true)
    public PortfolioResponse getPortfolioByApprenantEmail(String email) {
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email : " + email));

        Portfolio portfolio = portfolioRepository.findByApprenantId(user.getId())
                .orElseThrow(() -> new RuntimeException("Portfolio non trouvé pour cet apprenant."));

        return mapToResponse(portfolio, user);
    }

    @Transactional(readOnly = true)
    public PortfolioResponse getPortfolioById(Long id) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Portfolio introuvable avec l'ID : " + id));

        Apprenant apprenant = portfolio.getApprenant();
        Utilisateur user = apprenant != null ? utilisateurRepository.findById(apprenant.getId()).orElse(null) : null;

        return mapToResponse(portfolio, user);
    }

    @Transactional
    public PortfolioResponse updateMyPortfolio(String email, PortfolioUpdateRequest request) {
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email : " + email));

        Portfolio portfolio = portfolioRepository.findByApprenantId(user.getId())
                .orElseGet(() -> {
                    Apprenant apprenant = apprenantRepository.findById(user.getId())
                            .orElseThrow(() -> new RuntimeException("Apprenant non trouvé."));
                    return Portfolio.builder().apprenant(apprenant).build();
                });

        if (request.getBio() != null) portfolio.setBio(request.getBio());
        if (request.getTitreProfessionnel() != null) portfolio.setTitreProfessionnel(request.getTitreProfessionnel());
        if (request.getGithubUrl() != null) portfolio.setGithubUrl(request.getGithubUrl());
        if (request.getLinkedinUrl() != null) portfolio.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getWebsiteUrl() != null) portfolio.setWebsiteUrl(request.getWebsiteUrl());
        if (request.getCompetences() != null) portfolio.setCompetences(request.getCompetences());

        // Mise à jour de la photo de profil sur l'utilisateur
        if (request.getPhotoProfil() != null) {
            user.setPhotoProfil(request.getPhotoProfil());
            utilisateurRepository.save(user);
        }

        Portfolio updated = portfolioRepository.save(portfolio);
        return mapToResponse(updated, user);
    }

    @Transactional
    public void deletePortfolio(Long id) {
        if (!portfolioRepository.existsById(id)) {
            throw new RuntimeException("Portfolio introuvable avec l'ID : " + id);
        }
        portfolioRepository.deleteById(id);
    }

    private PortfolioResponse mapToResponse(Portfolio portfolio, Utilisateur user) {
        Apprenant apprenant = portfolio.getApprenant();
        return PortfolioResponse.builder()
                .id(portfolio.getId())
                .bio(portfolio.getBio())
                .titreProfessionnel(portfolio.getTitreProfessionnel())
                .githubUrl(portfolio.getGithubUrl())
                .linkedinUrl(portfolio.getLinkedinUrl())
                .websiteUrl(portfolio.getWebsiteUrl())
                .competences(portfolio.getCompetences())
                .apprenantId(apprenant != null ? apprenant.getId() : (user != null ? user.getId() : null))
                .nomApprenant(apprenant != null ? apprenant.getNom() : (user != null ? user.getNom() : null))
                .prenomApprenant(apprenant != null ? apprenant.getPrenom() : (user != null ? user.getPrenom() : null))
                .emailApprenant(apprenant != null ? apprenant.getEmail() : (user != null ? user.getEmail() : null))
                .photoProfil(user != null ? user.getPhotoProfil() : (apprenant != null ? apprenant.getPhotoProfil() : null))
                .build();
    }
}