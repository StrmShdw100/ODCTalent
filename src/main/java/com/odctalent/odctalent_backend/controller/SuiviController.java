package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.dto.EvolutionRequest;
import com.odctalent.odctalent_backend.dto.EvolutionResponse;
import com.odctalent.odctalent_backend.service.SuiviService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/suivi")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SuiviController {

    private final SuiviService suiviService;

    // ==================== ESPACE APPRENANT / ALUMNI ====================

    // 1. L'apprenant met à jour sa propre situation professionnelle
    @PostMapping("/me")
    public ResponseEntity<EvolutionResponse> ajouterMonEvolution(
            @RequestBody EvolutionRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(suiviService.ajouterEvolutionPourApprenantConnecte(request, authentication.getName()));
    }

    // 2. L'apprenant consulte son propre historique de carrière
    @GetMapping("/me")
    public ResponseEntity<List<EvolutionResponse>> getMonHistorique(Authentication authentication) {
        return ResponseEntity.ok(suiviService.getHistoriqueApprenantConnecte(authentication.getName()));
    }

    // ==================== ESPACE ADMIN ODC ====================

    // 3. L'admin ajoute ou rectifie le parcours d'un apprenant (avec notes privées)
    @PostMapping("/admin")
    public ResponseEntity<EvolutionResponse> ajouterEvolutionParAdmin(@RequestBody EvolutionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(suiviService.ajouterEvolution(request));
    }

    // 4. L'admin consulte l'historique complet d'un apprenant donné
    @GetMapping("/admin/apprenant/{apprenantId}")
    public ResponseEntity<List<EvolutionResponse>> getHistoriqueParApprenant(@PathVariable Long apprenantId) {
        return ResponseEntity.ok(suiviService.getHistoriqueApprenant(apprenantId));
    }
}