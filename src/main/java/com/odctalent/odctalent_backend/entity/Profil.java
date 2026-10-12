package com.odctalent.odctalent_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

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

    @Column(columnDefinition = "TEXT")
    private String experiences; 

    @ElementCollection
    @CollectionTable(name = "profil_competences", joinColumns = @JoinColumn(name = "profil_id"))
    @Column(name = "competence")
    private List<String> competences; 

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