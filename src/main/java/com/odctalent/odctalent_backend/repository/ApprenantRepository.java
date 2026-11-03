package com.odctalent.odctalent_backend.repository;

import com.odctalent.odctalent_backend.entity.Apprenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApprenantRepository extends JpaRepository<Apprenant, Long> {
    Optional<Apprenant> findByEmail(String email);

    @Query("SELECT DISTINCT a FROM Apprenant a LEFT JOIN FETCH a.portfolio p LEFT JOIN FETCH p.projets")
    List<Apprenant> findAllWithPortfolioAndProjets();
}