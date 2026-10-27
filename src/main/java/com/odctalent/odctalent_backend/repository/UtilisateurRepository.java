package com.odctalent.odctalent_backend.repository;
import com.odctalent.odctalent_backend.entity.enums.Role;
import com.odctalent.odctalent_backend.entity.Utilisateur;
import com.odctalent.odctalent_backend.entity.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<Utilisateur> findByActifFalse();
    long countByRole(Role role);
}