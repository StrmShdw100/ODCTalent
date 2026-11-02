package com.odctalent.odctalent_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import com.odctalent.odctalent_backend.entity.enums.Role;

@Entity
@Table(name = "utilisateurs")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "type_utilisateur", discriminatorType = DiscriminatorType.STRING)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class Utilisateur implements UserDetails {

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

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateInscription;

    private String statut; 

    @Column(nullable = false)
    private boolean actif = false; 

    @Enumerated(EnumType.STRING)
    private Role role;
    
    private LocalDateTime derniereConnexion;

    @Column(length = 500)
    private String photoProfil;

    @PrePersist
    protected void onCreate() {
        this.dateInscription = LocalDateTime.now();
        if (this.statut == null) {
            this.statut = "EN_ATTENTE";
        }
    }

    // =========================================================================
    // Implémentation des méthodes de UserDetails de Spring Security
    // =========================================================================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + (role != null ? role.name() : "APPRENANT")));
    }

    @Override
    public String getPassword() {
        return motDePasse;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return actif;
    }
}