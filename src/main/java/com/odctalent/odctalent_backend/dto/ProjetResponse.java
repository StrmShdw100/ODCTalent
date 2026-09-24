package com.odctalent.odctalent_backend.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjetResponse {
    private Long id;
    private String titre;
    private String description;
    private String imageUrl;
    private String githubUrl;
    private String demoUrl;
    private String technologies;
    private LocalDate dateCreation;
    private Long portfolioId;
}