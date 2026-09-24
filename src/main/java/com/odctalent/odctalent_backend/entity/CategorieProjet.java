package com.odctalent.odctalent_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories_projet")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategorieProjet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String libelle;

    private String description;
}