package com.odctalent.odctalent_backend.service;

import com.odctalent.odctalent_backend.dto.MessageRequest;
import com.odctalent.odctalent_backend.dto.MessageResponse;
import com.odctalent.odctalent_backend.entity.Message;
import com.odctalent.odctalent_backend.entity.Utilisateur;
import com.odctalent.odctalent_backend.repository.MessageRepository;
import com.odctalent.odctalent_backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Transactional
    public MessageResponse envoyerMessage(String emailExpediteur, MessageRequest request) {
        Utilisateur expediteur = utilisateurRepository.findByEmail(emailExpediteur)
                .orElseThrow(() -> new RuntimeException("Expéditeur introuvable."));

        Utilisateur destinataire = null;
        if (request.getDestinataireId() != null) {
            destinataire = utilisateurRepository.findById(request.getDestinataireId())
                    .orElseThrow(() -> new RuntimeException("Destinataire introuvable."));
        }

        Message message = Message.builder()
                .expediteur(expediteur)
                .destinataire(destinataire)
                .promotionCible(request.getPromotionCible())
                .contenu(request.getContenu())
                .dateEnvoi(LocalDateTime.now())
                .lu(false)
                .build();

        Message saved = messageRepository.save(message);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getConversation(String emailUser, Long autreUserId) {
        Utilisateur user = utilisateurRepository.findByEmail(emailUser)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));

        return messageRepository.findConversation(user.getId(), autreUserId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getMessagesRecus(String emailUser) {
        Utilisateur user = utilisateurRepository.findByEmail(emailUser)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));

        List<Message> messagesDirects = messageRepository.findByDestinataireIdOrderByDateEnvoiDesc(user.getId());
        return messagesDirects.stream().map(this::mapToResponse).toList();
    }

    private MessageResponse mapToResponse(Message m) {
        return MessageResponse.builder()
                .id(m.getId())
                .expediteurId(m.getExpediteur() != null ? m.getExpediteur().getId() : null)
                .nomExpediteur(m.getExpediteur() != null ? m.getExpediteur().getNom() : null)
                .prenomExpediteur(m.getExpediteur() != null ? m.getExpediteur().getPrenom() : null)
                .destinataireId(m.getDestinataire() != null ? m.getDestinataire().getId() : null)
                .nomDestinataire(m.getDestinataire() != null ? m.getDestinataire().getNom() : null)
                .prenomDestinataire(m.getDestinataire() != null ? m.getDestinataire().getPrenom() : null)
                .promotionCible(m.getPromotionCible())
                .contenu(m.getContenu())
                .dateEnvoi(m.getDateEnvoi())
                .lu(m.isLu())
                .build();
    }
}