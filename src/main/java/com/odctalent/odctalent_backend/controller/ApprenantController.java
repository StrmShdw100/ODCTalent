package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.dto.CompleteProfileRequest;
import com.odctalent.odctalent_backend.service.ApprenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/apprenants")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class ApprenantController {

    private final ApprenantService apprenantService;

    @PutMapping("/profile")
    public ResponseEntity<String> completeProfile(
            Authentication authentication,
            @RequestBody CompleteProfileRequest request) {
        
        String email = authentication.getName();
        apprenantService.completeProfile(email, request);
        
        return ResponseEntity.ok("Profil professionnel mis à jour avec succès !");
    }
}