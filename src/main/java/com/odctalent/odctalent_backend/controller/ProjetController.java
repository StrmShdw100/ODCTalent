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

@RestController
@RequestMapping("/api/v1/projets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProjetController {

    private final ProjetService projetService;

    // GET /api/v1/projets/portfolio/{portfolioId}
    @GetMapping("/portfolio/{portfolioId}")
    public ResponseEntity<List<ProjetResponse>> getProjetsByPortfolio(@PathVariable Long portfolioId) {
        return ResponseEntity.ok(projetService.getProjetsByPortfolioId(portfolioId));
    }

    // POST /api/v1/projets
    @PostMapping
    public ResponseEntity<ProjetResponse> addProjet(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ProjetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projetService.addProjetToMyPortfolio(userDetails.getUsername(), request));
    }

    // DELETE /api/v1/projets/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProjet(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        projetService.deleteProjet(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}