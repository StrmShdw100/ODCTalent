package com.odctalent.odctalent_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "recruteurs")
@PrimaryKeyJoinColumn(name = "utilisateur_id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Recruteur extends Utilisateur {

    @Column(length = 150)
    private String nomEntreprise;

    @Column(columnDefinition = "TEXT")
    private String descriptionEntreprise;

    private String secteurActivite;

    private String adresse;

    private String siteWeb;
}