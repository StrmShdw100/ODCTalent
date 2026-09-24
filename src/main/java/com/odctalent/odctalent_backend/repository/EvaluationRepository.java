package com.odctalent.odctalent_backend.repository;

import com.odctalent.odctalent_backend.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByApprenantId(Long apprenantId);
    List<Evaluation> findByMissionId(Long missionId);
}