package com.odctalent.odctalent_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "evolutions_professionnelles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvolutionProfessionnelle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String poste; // Ex: Développeur Backend, Lead Dev, CEO

    private String entreprise; // Ex: Orange Mali, Startup, Freelance

    @Column(nullable = false)
    private String statutEmploi; // CDI, CDD, FREELANCE, ENTREPRENEUR, EN_RECHERCHE, FORMATION

    private String localisation;

    private LocalDate dateDebut;
    private LocalDate dateFin; // null si c'est le poste actuel

    @Column(columnDefinition = "TEXT")
    private String remarquesAdmin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apprenant_id", nullable = false)
    private Apprenant apprenant;
}