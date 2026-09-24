package com.odctalent.odctalent_backend.repository;

import com.odctalent.odctalent_backend.entity.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FormationRepository extends JpaRepository<Formation, Long> {
    List<Formation> findByApprenantId(Long apprenantId);
}