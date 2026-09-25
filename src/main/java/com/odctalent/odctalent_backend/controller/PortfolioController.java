package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.dto.PortfolioResponse;
import com.odctalent.odctalent_backend.dto.PortfolioUpdateRequest;
import com.odctalent.odctalent_backend.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/portfolios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PortfolioController {

    private final PortfolioService portfolioService;

    // GET /api/v1/portfolios/me -> Portfolio de l'apprenant connecté
    @GetMapping("/me")
    public ResponseEntity<PortfolioResponse> getMyPortfolio(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(portfolioService.getPortfolioByApprenantEmail(userDetails.getUsername()));
    }

    // GET /api/v1/portfolios/{id} -> Consultation publique d'un portfolio
    @GetMapping("/{id}")
    public ResponseEntity<PortfolioResponse> getPortfolioById(@PathVariable Long id) {
        return ResponseEntity.ok(portfolioService.getPortfolioById(id));
    }

    // PUT /api/v1/portfolios/me -> Mise à jour du portfolio
    @PutMapping("/me")
    public ResponseEntity<PortfolioResponse> updateMyPortfolio(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PortfolioUpdateRequest request) {
        return ResponseEntity.ok(portfolioService.updateMyPortfolio(userDetails.getUsername(), request));
    }

    // DELETE /api/v1/portfolios/{id} -> Suppression d'un portfolio par son ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable Long id) {
        portfolioService.deletePortfolio(id);
        return ResponseEntity.noContent().build();
    }
}