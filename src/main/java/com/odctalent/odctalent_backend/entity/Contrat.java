package com.odctalent.odctalent_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "contrats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contrat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dateCreation;

    private LocalDateTime dateSignature;

    private String statut;

    @Column(columnDefinition = "TEXT")
    private String termesEtConditions;

    @OneToOne
    @JoinColumn(name = "candidature_id", nullable = false, unique = true)
    private Candidature candidature;

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDateTime.now();
        if (this.statut == null) {
            this.statut = "BROUILLON";
        }
    }
}