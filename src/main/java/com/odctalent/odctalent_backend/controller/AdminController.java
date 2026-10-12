package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.entity.Utilisateur;
import com.odctalent.odctalent_backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UtilisateurRepository utilisateurRepository;

    @GetMapping("/utilisateurs")
    public ResponseEntity<List<Utilisateur>> listerTousLesUtilisateurs() {
        List<Utilisateur> tousLesUtilisateurs = utilisateurRepository.findAll();
        return ResponseEntity.ok(tousLesUtilisateurs);
    }

    @GetMapping("/utilisateurs/en-attente")
    public ResponseEntity<List<Utilisateur>> listerUtilisateursEnAttente() {
        List<Utilisateur> utilisateursEnAttente = utilisateurRepository.findByActifFalse();
        return ResponseEntity.ok(utilisateursEnAttente);
    }

    @PutMapping("/utilisateurs/{id}/autoriser")
    public ResponseEntity<String> autoriserUtilisateur(@PathVariable Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'ID : " + id));

        utilisateur.setActif(true);
        utilisateur.setStatut("ACTIF");
        
        utilisateurRepository.save(utilisateur);

        return ResponseEntity.ok("Le compte de " + utilisateur.getPrenom() + " " + utilisateur.getNom() + " a été autorisé avec succès !");
    }

    @DeleteMapping("/utilisateurs/{id}/refuser")
    public ResponseEntity<String> refuserUtilisateur(@PathVariable Long id) {
        if (!utilisateurRepository.existsById(id)) {
            throw new RuntimeException("Utilisateur introuvable.");
        }
        utilisateurRepository.deleteById(id);
        return ResponseEntity.ok("Le compte a été refusé et supprimé avec succès.");
    }
}