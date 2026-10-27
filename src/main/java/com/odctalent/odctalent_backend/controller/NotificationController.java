package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.entity.Notification;
import com.odctalent.odctalent_backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(notificationService.getMyNotifications(userDetails.getUsername()));
    }

    @PatchMapping("/{id}/lire")
    public ResponseEntity<Void> marquerCommeLue(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.marquerCommeLue(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}