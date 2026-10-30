package com.odctalent.odctalent_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PortfolioResponse {
    private Long id;
    private String bio;
    private String titreProfessionnel;
    private String githubUrl;
    private String linkedinUrl;
    private String websiteUrl;
    private String competences;
    private Long apprenantId;
    private String nomApprenant;
    private String prenomApprenant;
    private String emailApprenant;
    private String photoProfil;
    private Boolean disponible;
}