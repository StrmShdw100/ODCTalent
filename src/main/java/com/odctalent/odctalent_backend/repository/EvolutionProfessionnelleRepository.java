package com.odctalent.odctalent_backend.repository;

import com.odctalent.odctalent_backend.entity.EvolutionProfessionnelle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvolutionProfessionnelleRepository extends JpaRepository<EvolutionProfessionnelle, Long> {
    List<EvolutionProfessionnelle> findByApprenantIdOrderByDateDebutDesc(Long apprenantId);
    List<EvolutionProfessionnelle> findByStatutEmploi(String statutEmploi);
    
}