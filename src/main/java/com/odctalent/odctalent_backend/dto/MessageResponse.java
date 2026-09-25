package com.odctalent.odctalent_backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MessageResponse {
    private Long id;
    private Long expediteurId;
    private String nomExpediteur;
    private String prenomExpediteur;
    private Long destinataireId;
    private String nomDestinataire;
    private String prenomDestinataire;
    private String promotionCible;
    private String contenu;
    private LocalDateTime dateEnvoi;
    private boolean lu;
}