package com.odctalent.odctalent_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {
    private long totalApprenants;
    private long totalRecruteurs;
    private long totalOpportunites;
    private long totalAdministrateurs;
    private long comptesEnAttente;
    private long totalCandidatures;

    private List<ActivityDTO> recentActivities;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ActivityDTO {
        private String title;
        private String time;
        private String type;
    }
}