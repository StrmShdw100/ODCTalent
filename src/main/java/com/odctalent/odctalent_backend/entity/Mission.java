package com.odctalent.odctalent_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "missions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    private Double budget;
    private String competencesRequises;
    private String statut;
    private LocalDate datePublication;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruteur_id", nullable = false)
    private Recruteur recruteur;
}