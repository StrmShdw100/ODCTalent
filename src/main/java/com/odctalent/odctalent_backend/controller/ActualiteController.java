package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.entity.Actualite;
import com.odctalent.odctalent_backend.repository.ActualiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/actualites")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ActualiteController {

    private final ActualiteRepository actualiteRepository;

    @GetMapping
    public ResponseEntity<List<Actualite>> getAllActualites() {
        return ResponseEntity.ok(actualiteRepository.findAll());
    }

    // 🔒 Réservé aux administrateurs (Création)
    @PostMapping
    public ResponseEntity<?> createActualite(@RequestBody Actualite actualite, Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Accès refusé : Seul un administrateur peut publier une actualité.");
        }

        if (actualite.getBadge() == null) actualite.setBadge("ODC");
        if (actualite.getStatus() == null) actualite.setStatus("Publié");
        if (actualite.getAuthor() == null) actualite.setAuthor("Admin ODC");

        Actualite saved = actualiteRepository.save(actualite);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // 🔒 Réservé aux administrateurs (Modification)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateActualite(@PathVariable Long id, @RequestBody Actualite actualiteDetails, Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Accès refusé : Seul un administrateur peut modifier une actualité.");
        }

        Actualite existingActualite = actualiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Actualité introuvable avec l'ID : " + id));

        existingActualite.setTitle(actualiteDetails.getTitle());
        existingActualite.setDescription(actualiteDetails.getDescription());
        existingActualite.setCategory(actualiteDetails.getCategory());
        existingActualite.setPublicationDate(actualiteDetails.getPublicationDate());
        existingActualite.setStatus(actualiteDetails.getStatus());
        existingActualite.setToutesPromotions(actualiteDetails.getToutesPromotions());
        existingActualite.setPromotionsCibles(actualiteDetails.getPromotionsCibles());
        
        if (actualiteDetails.getImageUrl() != null && !actualiteDetails.getImageUrl().isEmpty()) {
            existingActualite.setImageUrl(actualiteDetails.getImageUrl());
        }

        Actualite updated = actualiteRepository.save(existingActualite);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteActualite(@PathVariable Long id, Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Accès refusé : Seul un administrateur peut supprimer une actualité.");
        }

        if (!actualiteRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        actualiteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}