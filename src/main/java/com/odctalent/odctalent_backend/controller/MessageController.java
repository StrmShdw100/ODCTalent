package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.dto.MessageRequest;
import com.odctalent.odctalent_backend.dto.MessageResponse;
import com.odctalent.odctalent_backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    // Envoyer un message (direct ou diffusé par promotion)
    @PostMapping
    public ResponseEntity<MessageResponse> envoyerMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody MessageRequest request) {
        String email = userDetails.getUsername();
        MessageResponse response = messageService.envoyerMessage(email, request);
        return ResponseEntity.ok(response);
    }

    // Récupérer la conversation 1-to-1 avec un autre utilisateur
    @GetMapping("/conversation/{autreUserId}")
    public ResponseEntity<List<MessageResponse>> getConversation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long autreUserId) {
        String email = userDetails.getUsername();
        List<MessageResponse> conversation = messageService.getConversation(email, autreUserId);
        return ResponseEntity.ok(conversation);
    }

    // Récupérer les messages reçus par l'utilisateur connecté
    @GetMapping("/recus")
    public ResponseEntity<List<MessageResponse>> getMessagesRecus(
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        List<MessageResponse> messages = messageService.getMessagesRecus(email);
        return ResponseEntity.ok(messages);
    }
}