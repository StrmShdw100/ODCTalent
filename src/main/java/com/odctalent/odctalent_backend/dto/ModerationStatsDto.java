package com.odctalent.odctalent_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModerationStatsDto {
    @JsonProperty("total")
    private long total;

    @JsonProperty("aExaminer")
    private long aExaminer;

    @JsonProperty("validesMois")
    private long validesMois;

    @JsonProperty("refusesMois")
    private long refusesMois;

    @JsonProperty("tempsTraitement")
    private String tempsTraitement;
}