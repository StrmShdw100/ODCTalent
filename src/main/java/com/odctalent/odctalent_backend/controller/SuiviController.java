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


    @PostMapping("/me")
    public ResponseEntity<EvolutionResponse> ajouterMonEvolution(
            @RequestBody EvolutionRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(suiviService.ajouterEvolutionPourApprenantConnecte(request, authentication.getName()));
    }

    @GetMapping("/me")
    public ResponseEntity<List<EvolutionResponse>> getMonHistorique(Authentication authentication) {
        return ResponseEntity.ok(suiviService.getHistoriqueApprenantConnecte(authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerEvolution(@PathVariable Long id, Authentication authentication) {
        suiviService.supprimerEvolution(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }


    // 3. L'admin ajoute ou rectifie le parcours d'un apprenant (avec notes privées)
    @PostMapping("/admin")
    public ResponseEntity<EvolutionResponse> ajouterEvolutionParAdmin(@RequestBody EvolutionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(suiviService.ajouterEvolution(request));
    }

    @GetMapping("/admin/apprenant/{apprenantId}")
    public ResponseEntity<List<EvolutionResponse>> getHistoriqueParApprenant(@PathVariable Long apprenantId) {
        return ResponseEntity.ok(suiviService.getHistoriqueApprenant(apprenantId));
    }
}