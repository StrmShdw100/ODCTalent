package com.odctalent.odctalent_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MissionRequest {
    private String titre;
    private String description;
    private Double budget;
    private String competencesRequises;
    private String statut;
}