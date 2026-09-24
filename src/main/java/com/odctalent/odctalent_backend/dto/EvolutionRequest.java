package com.odctalent.odctalent_backend.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvolutionRequest {
    private Long apprenantId;
    private String poste;
    private String entreprise;
    private String statutEmploi;
    private String localisation;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String remarquesAdmin;
}