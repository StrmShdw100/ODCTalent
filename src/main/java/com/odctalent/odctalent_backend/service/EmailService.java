package com.odctalent.odctalent_backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendWelcomeEmail(String toEmail, String prenom) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Bienvenue sur ODCTalent !");

            String content = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #000000;'>"
                    + "<h2 style='color: #FF6501;'>Bienvenue sur ODCTalent, " + prenom + " !</h2>"
                    + "<p>Votre compte a été créé avec succès.</p>"
                    + "<p>Vous pouvez dès à présent vous connecter pour compléter votre profil, ajouter vos projets ou publier des opportunités.</p>"
                    + "<br><p>L'équipe ODCTalent</p>"
                    + "</div>";

            helper.setText(content, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            // Log l'erreur sans bloquer la création de compte si SMTP n'est pas encore configuré
            System.err.println("Impossible d'envoyer l'e-mail de bienvenue : " + e.getMessage());
        }
    }

    public void sendCandidatureStatusEmail(String toEmail, String titreMission, String nouveauStatut, String prenom) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Mise à jour de votre candidature - ODCTalent");

            // Choisir une couleur selon le statut (vert si accepté, rouge si refusé, orange par défaut)
            String color = nouveauStatut.equalsIgnoreCase("ACCEPTEE") ? "#28a745"
                    : (nouveauStatut.equalsIgnoreCase("REFUSEE") ? "#dc3545" : "#FF6501");

            String content = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #000000;'>"
                    + "<h2 style='color: #FF6501;'>Mise à jour de votre candidature</h2>"
                    + "<p>Bonjour <b>" + prenom + "</b>,</p>"
                    + "<p>Le statut de votre candidature pour la mission <b>\"" + titreMission + "\"</b> a été mis à jour.</p>"
                    + "<p>Nouveau statut : <span style='color: " + color + "; font-weight: bold;'>" + nouveauStatut + "</span></p>"
                    + "<br><p>Connectez-vous sur ODCTalent pour consulter les détails.</p>"
                    + "<br><p>L'équipe ODCTalent</p>"
                    + "</div>";

            helper.setText(content, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Impossible d'envoyer l'e-mail de mise à jour de candidature : " + e.getMessage());
        }
    }
}