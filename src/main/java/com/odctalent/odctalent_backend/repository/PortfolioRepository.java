package com.odctalent.odctalent_backend.repository;

import com.odctalent.odctalent_backend.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    Optional<Portfolio> findByApprenantId(Long apprenantId);
    List<Portfolio> findByVisibilite(String visibilite);
}