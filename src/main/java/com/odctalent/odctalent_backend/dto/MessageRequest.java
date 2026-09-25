package com.odctalent.odctalent_backend.dto;

import lombok.Data;

@Data
public class MessageRequest {
    private Long destinataireId;   // Null si c'est un message groupé
    private String promotionCible; // Ex: "PROMO_2026", "TOUTES", ou null si message direct
    private String contenu;        // Le texte du message
}