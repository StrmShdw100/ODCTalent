package com.odctalent.odctalent_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvisRequest {
    private Long missionId;
    private Long apprenantId;
    private String commentaire;
}