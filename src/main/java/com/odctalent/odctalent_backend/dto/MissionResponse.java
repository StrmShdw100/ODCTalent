package com.odctalent.odctalent_backend.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MissionResponse {
    private Long id;
    private String titre;
    private String description;
    private Double budget;
    private String competencesRequises;
    private String statut;
    private LocalDate datePublication;
    private Long recruteurId;
    private String nomRecruteur;
    private String prenomRecruteur;
    private String emailRecruteur;
}