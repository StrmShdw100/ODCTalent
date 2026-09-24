package com.odctalent.odctalent_backend.repository;

import com.odctalent.odctalent_backend.entity.Contrat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ContratRepository extends JpaRepository<Contrat, Long> {
    Optional<Contrat> findByCandidatureId(Long candidatureId);
}