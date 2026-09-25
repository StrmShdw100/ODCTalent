package com.odctalent.odctalent_backend.repository;

import com.odctalent.odctalent_backend.entity.Avis;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AvisRepository extends JpaRepository<Avis, Long> {
    List<Avis> findByApprenantId(Long apprenantId);
    List<Avis> findByMissionId(Long missionId);
    List<Avis> findByRecruteurId(Long recruteurId);
}