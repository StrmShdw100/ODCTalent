package com.odctalent.odctalent_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PortfolioUpdateRequest {
    private String bio;
    private String titreProfessionnel;
    private String githubUrl;
    private String linkedinUrl;
    private String websiteUrl;
    private String competences;
    private String photoProfil;
}