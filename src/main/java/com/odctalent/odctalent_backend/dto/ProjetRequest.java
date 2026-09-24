package com.odctalent.odctalent_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjetRequest {
    private String titre;
    private String description;
    private String imageUrl;
    private String githubUrl;
    private String demoUrl;
    private String technologies;
}