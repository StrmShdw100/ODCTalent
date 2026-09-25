package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.dto.AvisRequest;
import com.odctalent.odctalent_backend.dto.AvisResponse;
import com.odctalent.odctalent_backend.service.AvisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/avis")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AvisController {

    private final AvisService avisService;

    // POST /api/v1/avis
    @PostMapping
    public ResponseEntity<AvisResponse> creerAvis(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody AvisRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(avisService.creerAvis(userDetails.getUsername(), request));
    }

    // GET /api/v1/avis/apprenant/{apprenantId}
    @GetMapping("/apprenant/{apprenantId}")
    public ResponseEntity<List<AvisResponse>> getAvisByApprenant(@PathVariable Long apprenantId) {
        return ResponseEntity.ok(avisService.getAvisByApprenant(apprenantId));
    }

    // GET /api/v1/avis/mission/{missionId}
    @GetMapping("/mission/{missionId}")
    public ResponseEntity<List<AvisResponse>> getAvisByMission(@PathVariable Long missionId) {
        return ResponseEntity.ok(avisService.getAvisByMission(missionId));
    }
}