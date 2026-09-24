package com.odctalent.odctalent_backend.repository;

import com.odctalent.odctalent_backend.entity.Mission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MissionRepository extends JpaRepository<Mission, Long> {
    List<Mission> findByRecruteurId(Long recruteurId);
    List<Mission> findByStatut(String statut);
}