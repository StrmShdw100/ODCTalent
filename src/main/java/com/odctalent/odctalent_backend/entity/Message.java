package com.odctalent.odctalent_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // L'expéditeur du message (Admin, Recruteur ou Apprenant)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expediteur_id", nullable = false)
    private Utilisateur expediteur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destinataire_id", nullable = true)
    private Utilisateur destinataire;

    @Column(nullable = true)
    private String promotionCible;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenu;

    @Column(nullable = false)
    private LocalDateTime dateEnvoi;

    @Builder.Default
    private boolean lu = false;
}