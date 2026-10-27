package com.odctalent.odctalent_backend.service;

import com.odctalent.odctalent_backend.entity.Notification;
import com.odctalent.odctalent_backend.entity.Recruteur;
import com.odctalent.odctalent_backend.entity.Utilisateur;
import com.odctalent.odctalent_backend.repository.NotificationRepository;
import com.odctalent.odctalent_backend.repository.RecruteurRepository;
import com.odctalent.odctalent_backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final RecruteurRepository recruteurRepository;

    @Transactional(readOnly = true)
    public List<Notification> getMyNotifications(String emailUser) {
        Utilisateur user = utilisateurRepository.findByEmail(emailUser)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));
        return notificationRepository.findByDestinataireIdOrderByDateCreationDesc(user.getId());
    }

    @Transactional
    public void marquerCommeLue(Long notificationId, String emailUser) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification introuvable."));

        if (!notification.getDestinataire().getEmail().equals(emailUser)) {
            throw new RuntimeException("Non autorisé à modifier cette notification.");
        }

        notification.setLue(true);
        notification.setDateLecture(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    @Transactional
    public void envoyerNotification(Long destinataireId, String titre, String message, String type, Long referenceId) {
        Utilisateur destinataire = utilisateurRepository.findById(destinataireId)
                .orElseThrow(() -> new RuntimeException("Destinataire introuvable."));

        Notification notification = Notification.builder()
                .titre(titre)
                .message(message)
                .type(type)
                .referenceId(referenceId)
                .destinataire(destinataire)
                .lue(false)
                .dateCreation(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    @Transactional
    public void envoyerNotificationTousLesRecruteurs(String titre, String message, String type) {
        List<Recruteur> recruteurs = recruteurRepository.findAll();
        for (Recruteur recruteur : recruteurs) {
            envoyerNotification(recruteur.getId(), titre, message, type, null);
        }
    }
}