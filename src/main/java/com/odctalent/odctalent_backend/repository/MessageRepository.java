package com.odctalent.odctalent_backend.repository;

import com.odctalent.odctalent_backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Récupérer la conversation 1-to-1 entre deux utilisateurs
    @Query("SELECT m FROM Message m WHERE (m.expediteur.id = :user1 AND m.destinataire.id = :user2) OR (m.expediteur.id = :user2 AND m.destinataire.id = :user1) ORDER BY m.dateEnvoi ASC")
    List<Message> findConversation(@Param("user1") Long user1, @Param("user2") Long user2);

    // Récupérer les messages directs reçus par un utilisateur
    List<Message> findByDestinataireIdOrderByDateEnvoiDesc(Long destinataireId);

    // Récupérer les messages diffusés pour une promotion spécifique ou pour "TOUTES"
    List<Message> findByPromotionCibleInOrderByDateEnvoiDesc(List<String> promotions);
}