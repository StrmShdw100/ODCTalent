package com.odctalent.odctalent_backend.repository;

import com.odctalent.odctalent_backend.entity.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CandidatureRepository extends JpaRepository<Candidature, Long> {
    List<Candidature> findByMissionId(Long missionId);
    List<Candidature> findByApprenantId(Long apprenantId);
    Optional<Candidature> findByMissionIdAndApprenantId(Long missionId, Long apprenantId);
}