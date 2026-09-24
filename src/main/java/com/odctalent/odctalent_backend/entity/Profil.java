package com.odctalent.odctalent_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profils")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String biographie;

    private String adresse;

    private String ville;

    private String pays;

    private String siteWeb;

    private String github;

    private String linkedin;

    @OneToOne
    @JoinColumn(name = "apprenant_id", nullable = false, unique = true)
    private Apprenant apprenant;
}