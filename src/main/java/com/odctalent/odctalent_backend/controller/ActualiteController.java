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