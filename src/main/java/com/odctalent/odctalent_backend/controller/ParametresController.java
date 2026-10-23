package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.entity.Administrateur;
import com.odctalent.odctalent_backend.entity.Utilisateur;
import com.odctalent.odctalent_backend.repository.UtilisateurRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/admin/parametres")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ParametresController {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/profil")
    public ResponseEntity<?> getProfil(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Non authentifié.");
        }
        
        Utilisateur user = utilisateurRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        String roleAdmin = "Administrateur";
        if (user instanceof Administrateur) {
            roleAdmin = ((Administrateur) user).getRoleAdmin();
        }

        ProfilResponse response = new ProfilResponse(
                user.getId(),
                user.getPrenom(),
                user.getNom(),
                user.getEmail(),
                user.getTelephone(),
                roleAdmin
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profil")
    public ResponseEntity<?> updateProfil(@RequestBody ProfilUpdateDTO dto, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Non authentifié.");
        }
        
        Utilisateur user = utilisateurRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        user.setPrenom(dto.getPrenom());
        user.setNom(dto.getNom());
        user.setTelephone(dto.getTelephone());

        utilisateurRepository.save(user);
        return ResponseEntity.ok("Profil mis à jour avec succès.");
    }

    @PutMapping("/mot-de-passe")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordUpdateDTO dto, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Non authentifié.");
        }
        
        Utilisateur user = utilisateurRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!passwordEncoder.matches(dto.getAncienMotDePasse(), user.getMotDePasse())) {
            return ResponseEntity.status(400).body("L'ancien mot de passe est incorrect.");
        }

        user.setMotDePasse(passwordEncoder.encode(dto.getNouveauMotDePasse()));
        utilisateurRepository.save(user);
        
        return ResponseEntity.ok("Mot de passe mis à jour avec succès.");
    }


    @Data
    public static class ProfilResponse {
        private Long id;
        private String prenom;
        private String nom;
        private String email;
        private String telephone;
        private String roleAdmin;

        public ProfilResponse(Long id, String prenom, String nom, String email, String telephone, String roleAdmin) {
            this.id = id;
            this.prenom = prenom;
            this.nom = nom;
            this.email = email;
            this.telephone = telephone;
            this.roleAdmin = roleAdmin;
        }
    }

    @Data
    public static class ProfilUpdateDTO {
        private String prenom;
        private String nom;
        private String telephone;
    }

    @Data
    public static class PasswordUpdateDTO {
        private String ancienMotDePasse;
        private String nouveauMotDePasse;
    }
}