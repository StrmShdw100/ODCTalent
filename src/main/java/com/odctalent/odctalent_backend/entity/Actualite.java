package com.odctalent.odctalent_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

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

    private Boolean toutesPromotions;

    @ElementCollection
    @CollectionTable(name = "actualite_promotions", joinColumns = @JoinColumn(name = "actualite_id"))
    @Column(name = "promotion")
    private List<String> promotionsCibles;
}