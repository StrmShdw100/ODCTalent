package com.odctalent.odctalent_backend.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvolutionResponse {
    private Long id;
    private Long apprenantId;
    private String nomApprenant;
    private String prenomApprenant;
    private String emailApprenant;
    private String poste;
    private String entreprise;
    private String statutEmploi;
    private String localisation;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String remarquesAdmin;
}