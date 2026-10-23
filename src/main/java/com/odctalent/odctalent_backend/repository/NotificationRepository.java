package com.odctalent.odctalent_backend.repository;

import com.odctalent.odctalent_backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByOrderByDateCreationDesc();
    long countByLueFalse();

    List<Notification> findByDestinataireIdOrderByDateCreationDesc(Long destinataireId);

    long countByDestinataireIdAndLueFalse(Long destinataireId);

    Optional<Notification> findByTypeAndReferenceId(String type, Long referenceId);
}