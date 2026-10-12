package com.odctalent.odctalent_backend.repository;

import com.odctalent.odctalent_backend.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<Utilisateur> findByActifFalse();
    @Query("SELECT COUNT(u) FROM Utilisateur u WHERE u.role = :role")
    long countByRole(@Param("role") String role);
}