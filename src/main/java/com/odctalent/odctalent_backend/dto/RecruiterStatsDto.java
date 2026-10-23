package com.odctalent.odctalent_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruiterStatsDto {
    private long missionsPubliees;
    private long candidaturesRecues;
    private long candidaturesEnCours;
    private long contratsActifs;
}