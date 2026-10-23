package com.odctalent.odctalent_backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContratResponse {
    private Long id;
    private LocalDateTime dateCreation;
    private String statut;
    private String termesEtConditions;
    private Long candidatureId;
    private String titreMission;
    private String nomCandidat;
    private String prenomCandidat;
    private String formationCandidat;
}