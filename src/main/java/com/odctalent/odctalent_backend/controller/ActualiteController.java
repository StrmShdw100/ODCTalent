package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.entity.Actualite;
import com.odctalent.odctalent_backend.repository.ActualiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public ResponseEntity<Actualite> createActualite(@RequestBody Actualite actualite) {
        // Valeurs par défaut si non renseignées
        if (actualite.getBadge() == null) actualite.setBadge("ODC");
        if (actualite.getStatus() == null) actualite.setStatus("Publié");
        if (actualite.getAuthor() == null) actualite.setAuthor("Admin ODC");

        Actualite saved = actualiteRepository.save(actualite);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActualite(@PathVariable Long id) {
        if (!actualiteRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        actualiteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}