package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.entity.Recruteur;
import com.odctalent.odctalent_backend.service.RecruteurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/recruteurs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminRecruteurController {

    private final RecruteurService recruteurService;

    @GetMapping
    public ResponseEntity<List<Recruteur>> getAllRecruteurs() {
        List<Recruteur> recruteurs = recruteurService.listerTous();
        return ResponseEntity.ok(recruteurs);
    }

    @PostMapping
    public ResponseEntity<Recruteur> creerRecruteur(@RequestBody Recruteur recruteur) {
        Recruteur nouveau = recruteurService.creerRecruteur(recruteur);
        return ResponseEntity.status(HttpStatus.CREATED).body(nouveau);
    }

    @PutMapping("/{id}/autoriser")
    public ResponseEntity<String> autoriserRecruteur(@PathVariable Long id) {
        recruteurService.autoriserRecruteur(id);
        return ResponseEntity.ok("Compte recruteur autorisé avec succès.");
    }
}