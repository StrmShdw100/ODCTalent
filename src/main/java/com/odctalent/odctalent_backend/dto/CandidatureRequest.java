package com.odctalent.odctalent_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidatureRequest {
    private Long missionId;
    private String lettreMotivation;
    private Double tarifPropose;
}