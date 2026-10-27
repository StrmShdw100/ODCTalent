package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.entity.Utilisateur;
import com.odctalent.odctalent_backend.entity.enums.Role;
import com.odctalent.odctalent_backend.repository.NotificationRepository;
import com.odctalent.odctalent_backend.repository.UtilisateurRepository;
import com.odctalent.odctalent_backend.dto.AdminCreationDTO;
import com.odctalent.odctalent_backend.entity.Administrateur;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final UtilisateurRepository utilisateurRepository;
    private final NotificationRepository notificationRepository; 
    private final PasswordEncoder passwordEncoder;

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

        notificationRepository.findByTypeAndReferenceId("COMPTE_EN_ATTENTE", id)
                .ifPresent(notificationRepository::delete);

        return ResponseEntity.ok("Le compte de " + utilisateur.getPrenom() + " " + utilisateur.getNom() + " a été autorisé avec succès !");
    }

    @DeleteMapping("/utilisateurs/{id}/refuser")
    public ResponseEntity<String> refuserUtilisateur(@PathVariable Long id) {
        if (!utilisateurRepository.existsById(id)) {
            throw new RuntimeException("Utilisateur introuvable.");
        }
        
        utilisateurRepository.deleteById(id);

        notificationRepository.findByTypeAndReferenceId("COMPTE_EN_ATTENTE", id)
                .ifPresent(notificationRepository::delete);

        return ResponseEntity.ok("Le compte a été refusé et supprimé avec succès.");
    }

    @GetMapping("/administrateurs")
    public ResponseEntity<List<Administrateur>> listerAdministrateurs() {
        List<Administrateur> admins = utilisateurRepository.findAll().stream()
                .filter(u -> u instanceof com.odctalent.odctalent_backend.entity.Administrateur)
                .map(u -> (com.odctalent.odctalent_backend.entity.Administrateur) u)
                .toList();
        return ResponseEntity.ok(admins);
    }

    @PostMapping("/administrateurs")
    public ResponseEntity<?> creerAdministrateur(@RequestBody AdminCreationDTO request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Non authentifié.");
        }

        String emailConnecte = principal.getName();
        Utilisateur adminConnecte = utilisateurRepository.findByEmail(emailConnecte)
                .orElseThrow(() -> new RuntimeException("Utilisateur connecté introuvable"));

        boolean estSuperAdmin = false;
        if (adminConnecte instanceof com.odctalent.odctalent_backend.entity.Administrateur) {
            com.odctalent.odctalent_backend.entity.Administrateur adm = (com.odctalent.odctalent_backend.entity.Administrateur) adminConnecte;
            if (adm.getRoleAdmin() != null && adm.getRoleAdmin().toLowerCase().contains("super")) {
                estSuperAdmin = true;
            }
        }
        if (adminConnecte.getRole() != null && adminConnecte.getRole().name().contains("SUPER")) {
            estSuperAdmin = true;
        }

        if (!estSuperAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Accès refusé : Seul un Super Administrateur peut créer de nouveaux administrateurs.");
        }

        com.odctalent.odctalent_backend.entity.Administrateur admin = new com.odctalent.odctalent_backend.entity.Administrateur();
        
        admin.setPrenom(request.getPrenom());
        admin.setNom(request.getNom());
        admin.setEmail(request.getEmail());
        admin.setTelephone(request.getTelephone());
        admin.setRole(Role.ADMIN);
        admin.setRoleAdmin(request.getRole() != null ? request.getRole() : "Administrateur");
        admin.setActif(true);
        admin.setStatut("ACTIF");
        admin.setDateInscription(LocalDateTime.now());

        if (request.getMotDePasse() != null && !request.getMotDePasse().isEmpty()) {
            admin.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        } else {
            admin.setMotDePasse(passwordEncoder.encode("Admin123!"));
        }

        Utilisateur saved = utilisateurRepository.save(admin);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/administrateurs/{id}")
    public ResponseEntity<String> supprimerAdministrateur(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Non authentifié.");
        }

        String emailConnecte = principal.getName();
        Utilisateur adminConnecte = utilisateurRepository.findByEmail(emailConnecte).orElse(null);
        
        boolean estSuperAdmin = false;
        if (adminConnecte instanceof com.odctalent.odctalent_backend.entity.Administrateur) {
            com.odctalent.odctalent_backend.entity.Administrateur adm = (com.odctalent.odctalent_backend.entity.Administrateur) adminConnecte;
            if (adm.getRoleAdmin() != null && adm.getRoleAdmin().toLowerCase().contains("super")) {
                estSuperAdmin = true;
            }
        }

        if (!estSuperAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Accès refusé : Seul un Super Administrateur peut supprimer un administrateur.");
        }

        if (!utilisateurRepository.existsById(id)) {
            throw new RuntimeException("Administrateur introuvable.");
        }
        utilisateurRepository.deleteById(id);
        return ResponseEntity.ok("Administrateur supprimé avec succès.");
    }
}