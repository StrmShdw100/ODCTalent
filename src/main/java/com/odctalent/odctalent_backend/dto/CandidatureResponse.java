package com.odctalent.odctalent_backend.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidatureResponse {
    private Long id;
    private String lettreMotivation;
    private Double tarifPropose;
    private String statut;
    private LocalDate dateCandidature;
    private Long missionId;
    private String titreMission;
    private Long apprenantId;
    private String nomApprenant;
    private String prenomApprenant;
    private String emailApprenant;
}