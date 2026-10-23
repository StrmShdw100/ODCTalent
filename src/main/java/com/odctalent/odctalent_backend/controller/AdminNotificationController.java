package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.entity.Notification;
import com.odctalent.odctalent_backend.repository.NotificationRepository;
import com.odctalent.odctalent_backend.service.NotificationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminNotificationController {

    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    private void nettoyerAnciennesNotifications() {
        LocalDateTime limiteLecture = LocalDateTime.now().minusHours(5);
        List<Notification> aSupprimer = notificationRepository.findAll().stream()
                .filter(n -> n.isLue() && n.getDateLecture() != null && n.getDateLecture().isBefore(limiteLecture))
                .toList();

        if (!aSupprimer.isEmpty()) {
            notificationRepository.deleteAll(aSupprimer);
        }
    }

    @GetMapping
    public ResponseEntity<List<Notification>> listerNotifications() {
        nettoyerAnciennesNotifications();
        return ResponseEntity.ok(notificationRepository.findByOrderByDateCreationDesc());
    }

    @PostMapping("/generer-test")
    public ResponseEntity<String> genererNotificationsTest() {
        nettoyerAnciennesNotifications();

        notificationRepository.save(Notification.builder()
            .titre("Nouveau compte apprenant")
            .message("Mamadou Diallo vient de créer un compte et attend la validation de son profil.")
            .type("COMPTE_EN_ATTENTE")
            .referenceId(101L)
            .lue(false)
            .dateCreation(LocalDateTime.now())
            .build());

        notificationRepository.save(Notification.builder()
            .titre("Nouveau projet soumis")
            .message("L'équipe 'ODCTalent Mobile' a soumis le projet 'Plateforme ODCTalent' pour modération.")
            .type("PROJET_SOUMIS")
            .referenceId(202L)
            .lue(false)
            .dateCreation(LocalDateTime.now())
            .build());

        notificationRepository.save(Notification.builder()
            .titre("Nouvelle offre de recrutement")
            .message("La société Orange Digital Kalanso a publié une nouvelle offre de stage Full-Stack Java/Angular.")
            .type("OFFRE_PUBLIEE")
            .referenceId(303L)
            .lue(true)
            .dateCreation(LocalDateTime.now().minusHours(2))
            .dateLecture(LocalDateTime.now().minusHours(1)) 
            .build());

        return ResponseEntity.ok("Notifications de test générées !");
    }

    @PutMapping("/{id}/lire")
    public ResponseEntity<String> marquerCommeLue(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification introuvable"));

        if (!notification.isLue()) {
            notification.setLue(true);
            notification.setDateLecture(LocalDateTime.now());
            notificationRepository.save(notification);
        }

        return ResponseEntity.ok("Notification marquée comme lue");
    }

    @PutMapping("/lire-tout")
    public ResponseEntity<String> toutMarquerCommeLu() {
        LocalDateTime now = LocalDateTime.now();
        List<Notification> notifications = notificationRepository.findAll();

        notifications.forEach(n -> {
            if (!n.isLue()) {
                n.setLue(true);
                n.setDateLecture(now); 
            }
        });

        notificationRepository.saveAll(notifications);
        return ResponseEntity.ok("Toutes marquées comme lues");
    }

    @DeleteMapping("/resoudre")
    public ResponseEntity<String> resoudreNotification(@RequestParam String type, @RequestParam Long referenceId) {
        notificationRepository.findByTypeAndReferenceId(type, referenceId)
                .ifPresent(notificationRepository::delete);
        return ResponseEntity.ok("Notification résolue et supprimée globalement.");
    }


    @PostMapping("/envoyer")
    public ResponseEntity<Void> envoyerNotificationRecruteur(@RequestBody NotificationRequest request) {
        notificationService.envoyerNotification(
                request.getDestinataireId(),
                request.getTitre(),
                request.getMessage(),
                request.getType(),
                request.getReferenceId()
        );
        return ResponseEntity.ok().build();
    }

    @PostMapping("/diffuser")
    public ResponseEntity<Void> diffuserNotificationRecruteurs(@RequestBody BroadcastRequest request) {
        notificationService.envoyerNotificationTousLesRecruteurs(
                request.getTitre(),
                request.getMessage(),
                request.getType()
        );
        return ResponseEntity.ok().build();
    }

    @Data
    public static class NotificationRequest {
        private Long destinataireId;
        private String titre;
        private String message;
        private String type;
        private Long referenceId;
    }

    @Data
    public static class BroadcastRequest {
        private String titre;
        private String message;
        private String type;
    }
}