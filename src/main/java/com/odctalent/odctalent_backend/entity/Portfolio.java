package com.odctalent.odctalent_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;
import java.util.ArrayList;

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

    private String visibilite;

    @OneToOne
    @JoinColumn(name = "apprenant_id", nullable = false, unique = true)
    @JsonIgnore
    private Apprenant apprenant;
    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Projet> projets=new ArrayList<>();
}