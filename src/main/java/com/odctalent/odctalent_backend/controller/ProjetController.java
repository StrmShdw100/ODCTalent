package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.dto.ProjetRequest;
import com.odctalent.odctalent_backend.dto.ProjetResponse;
import com.odctalent.odctalent_backend.service.ProjetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/projets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProjetController {

    private final ProjetService projetService;


    @GetMapping
    public ResponseEntity<List<ProjetResponse>> getAllProjets() {
        return ResponseEntity.ok(projetService.getAllProjets());
    }

    @GetMapping("/me")
    public ResponseEntity<List<ProjetResponse>> getMyProjets(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projetService.getProjetsByApprenantEmail(userDetails.getUsername()));
    }

    @GetMapping("/stats/moderation")
    public ResponseEntity<Map<String, Object>> getModerationStats() {
        return ResponseEntity.ok(projetService.getModerationStats());
    }


    @GetMapping("/portfolio/{portfolioId}")
    public ResponseEntity<List<ProjetResponse>> getProjetsByPortfolio(@PathVariable Long portfolioId) {
        return ResponseEntity.ok(projetService.getProjetsByPortfolioId(portfolioId));
    }

    @PostMapping
    public ResponseEntity<ProjetResponse> addProjet(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ProjetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projetService.addProjetToMyPortfolio(userDetails.getUsername(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProjet(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        projetService.deleteProjet(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjetResponse> getProjetById(@PathVariable Long id) {
        return ResponseEntity.ok(projetService.getProjetById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjetResponse> updateProjet(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ProjetRequest request) {
        return ResponseEntity.ok(projetService.updateProjet(id, userDetails.getUsername(), request));
    }
}