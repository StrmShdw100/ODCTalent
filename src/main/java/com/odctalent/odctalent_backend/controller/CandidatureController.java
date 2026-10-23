package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.dto.CandidatureRequest;
import com.odctalent.odctalent_backend.dto.CandidatureResponse;
import com.odctalent.odctalent_backend.service.CandidatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/candidatures")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CandidatureController {

    private final CandidatureService candidatureService;

    @PostMapping
    public ResponseEntity<CandidatureResponse> postuler(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CandidatureRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(candidatureService.postuler(userDetails.getUsername(), request));
    }

    @GetMapping("/me")
    public ResponseEntity<List<CandidatureResponse>> getMyCandidatures(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(candidatureService.getMyCandidatures(userDetails.getUsername()));
    }

    @GetMapping("/mission/{missionId}")
    public ResponseEntity<List<CandidatureResponse>> getCandidaturesByMission(@PathVariable Long missionId) {
        return ResponseEntity.ok(candidatureService.getCandidaturesByMission(missionId));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<CandidatureResponse> updateStatutCandidature(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String statut) {
        return ResponseEntity.ok(candidatureService.updateStatutCandidature(id, userDetails.getUsername(), statut));
    }
    
    @GetMapping("/recruteur")
    public ResponseEntity<List<CandidatureResponse>> getCandidaturesForRecruteur(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(candidatureService.getCandidaturesForRecruteur(userDetails.getUsername()));
    }
}
