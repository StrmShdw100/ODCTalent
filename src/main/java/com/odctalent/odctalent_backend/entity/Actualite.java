package com.odctalent.odctalent_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "actualites")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Actualite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String badge;
    private String title;

    @Column(length = 1000)
    private String description;

    private String category;
    private String publicationDate;
    private String status; 
    private String author;
    private String imageUrl;
}