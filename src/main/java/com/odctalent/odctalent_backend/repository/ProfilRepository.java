package com.odctalent.odctalent_backend.repository;

import com.odctalent.odctalent_backend.entity.Profil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfilRepository extends JpaRepository<Profil, Long> {
    Optional<Profil> findByApprenantId(Long apprenantId);
}