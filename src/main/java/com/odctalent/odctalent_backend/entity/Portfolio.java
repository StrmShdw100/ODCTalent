package com.odctalent.odctalent_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "portfolios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titreProfessionnel;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String githubUrl;
    private String linkedinUrl;
    private String websiteUrl;

    @Column(columnDefinition = "TEXT")
    private String competences;

    private String dateCreation;

    private String visibilite; // PUBLIC, PRIVE

    @OneToOne
    @JoinColumn(name = "apprenant_id", nullable = false, unique = true)
    private Apprenant apprenant;
}