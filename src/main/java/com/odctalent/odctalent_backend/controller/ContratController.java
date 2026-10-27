package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.entity.Contrat;
import com.odctalent.odctalent_backend.service.ContratService;
import com.odctalent.odctalent_backend.dto.ContratResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/contrats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContratController {

    private final ContratService contratService;

    @GetMapping
    public ResponseEntity<List<ContratResponse>> getContrats(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(contratService.getContratsForRecruteur(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<ContratResponse> creerContrat(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> payload) {
        Long candidatureId = Long.valueOf(payload.get("candidatureId").toString());
        String termes = (String) payload.get("termesEtConditions");
        
        ContratResponse nouveau = contratService.creerContrat(userDetails.getUsername(), candidatureId, termes);
        return ResponseEntity.status(HttpStatus.CREATED).body(nouveau);
    }
}