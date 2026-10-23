package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.entity.Recruteur;
import com.odctalent.odctalent_backend.entity.Utilisateur;
import com.odctalent.odctalent_backend.repository.RecruteurRepository;
import com.odctalent.odctalent_backend.repository.UtilisateurRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/recruteur/parametres")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecruteurParametresController {

    private final UtilisateurRepository utilisateurRepository;
    private final RecruteurRepository recruteurRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/profil")
    public ResponseEntity<?> getProfil(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Non authentifié.");
        }
        
        Utilisateur user = utilisateurRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Recruteur recruteur = recruteurRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Recruteur introuvable"));

        ProfilRecruteurResponse response = new ProfilRecruteurResponse(
                recruteur.getId(),
                recruteur.getPrenom(),
                recruteur.getNom(),
                recruteur.getEmail(),
                recruteur.getTelephone(),
                recruteur.getNomEntreprise(),
                recruteur.getAdresse(),
                recruteur.getSiteWeb()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profil")
    public ResponseEntity<?> updateProfil(@RequestBody ProfilRecruteurUpdateDTO dto, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Non authentifié.");
        }
        
        Utilisateur user = utilisateurRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Recruteur recruteur = recruteurRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Recruteur introuvable"));

        recruteur.setPrenom(dto.getPrenom());
        recruteur.setNom(dto.getNom());
        recruteur.setTelephone(dto.getTelephone());
        recruteur.setNomEntreprise(dto.getNomEntreprise());
        recruteur.setAdresse(dto.getAdresse());
        recruteur.setSiteWeb(dto.getSiteWeb());

        recruteurRepository.save(recruteur);
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
    public static class ProfilRecruteurResponse {
        private Long id;
        private String prenom;
        private String nom;
        private String email;
        private String telephone;
        private String nomEntreprise;
        private String adresse;
        private String siteWeb;

        public ProfilRecruteurResponse(Long id, String prenom, String nom, String email, String telephone, String nomEntreprise, String adresse, String siteWeb) {
            this.id = id;
            this.prenom = prenom;
            this.nom = nom;
            this.email = email;
            this.telephone = telephone;
            this.nomEntreprise = nomEntreprise;
            this.adresse = adresse;
            this.siteWeb = siteWeb;
        }
    }

    @Data
    public static class ProfilRecruteurUpdateDTO {
        private String prenom;
        private String nom;
        private String telephone;
        private String nomEntreprise;
        private String adresse;
        private String siteWeb;
    }

    @Data
    public static class PasswordUpdateDTO {
        private String ancienMotDePasse;
        private String nouveauMotDePasse;
    }
}