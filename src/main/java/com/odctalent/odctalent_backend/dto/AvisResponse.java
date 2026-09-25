package com.odctalent.odctalent_backend.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvisResponse {
    private Long id;
    private String commentaire;
    private LocalDate dateAvis;
    private Long missionId;
    private String titreMission;
    private Long recruteurId;
    private String nomRecruteur;
    private Long apprenantId;
    private String nomApprenant;
    private String prenomApprenant;
}