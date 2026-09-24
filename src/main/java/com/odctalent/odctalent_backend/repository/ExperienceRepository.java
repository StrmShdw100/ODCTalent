package com.odctalent.odctalent_backend.repository;

import com.odctalent.odctalent_backend.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findByApprenantId(Long apprenantId);
}