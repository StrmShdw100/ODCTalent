package com.odctalent.odctalent_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

import com.odctalent.odctalent_backend.entity.enums.Role;

@Entity
@Table(name = "utilisateurs")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, length = 100)
    private String prenom;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String motDePasse;

    private String telephone;

    private String photo;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateInscription;
    // ACTIF, SUSPENDU, EN_ATTENTE
    private String statut; 
    @Enumerated(EnumType.STRING)
    private Role role;
    private LocalDateTime derniereConnexion;

    @PrePersist
    protected void onCreate() {
        this.dateInscription = LocalDateTime.now();
        if (this.statut == null) {
            this.statut = "ACTIF";
        }
    }
}