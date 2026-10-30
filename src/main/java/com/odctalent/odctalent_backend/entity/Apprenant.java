package com.odctalent.odctalent_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "apprenants")
@PrimaryKeyJoinColumn(name = "utilisateur_id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Apprenant extends Utilisateur {

    @Column(unique = true, length = 50)
    private String matricule;

    private String promotion;

    private String formation;

    private String niveau;

    private String localisation;

    private Boolean disponible;

    @OneToOne(mappedBy = "apprenant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Profil profil;

    @OneToOne(mappedBy = "apprenant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Portfolio portfolio;
}