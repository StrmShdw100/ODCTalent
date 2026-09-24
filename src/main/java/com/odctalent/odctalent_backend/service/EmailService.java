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
}