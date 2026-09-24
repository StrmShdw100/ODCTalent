package com.odctalent.odctalent_backend.repository;

import com.odctalent.odctalent_backend.entity.Projet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjetRepository extends JpaRepository<Projet, Long> {
    List<Projet> findByStatut(String statut);
    List<Projet> findByPortfolioApprenantId(Long apprenantId);
    List<Projet> findByPortfolioId(Long portfolioId);
}