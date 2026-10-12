package com.odctalent.odctalent_backend.repository;

import com.odctalent.odctalent_backend.entity.Actualite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActualiteRepository extends JpaRepository<Actualite, Long> {
}