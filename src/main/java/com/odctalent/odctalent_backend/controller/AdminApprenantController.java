package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.entity.Apprenant;
import com.odctalent.odctalent_backend.service.ApprenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/apprenants")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // À ajuster selon l'URL de votre frontend Angular
public class AdminApprenantController {

    private final ApprenantService apprenantService;

   
    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> importerApprenants(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "Promotion 6") String promotion) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Le fichier téléversé est vide."));
        }

        try {
            List<Apprenant> apprenantsImportes = apprenantService.importerApprenantsExcel(file, promotion);
            return ResponseEntity.ok(Map.of(
                "message", "Importation réussie avec succès",
                "nombreImportes", apprenantsImportes.size(),
                "promotion", promotion
            ));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la lecture du fichier Excel : " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Erreur lors du traitement des données : " + e.getMessage()));
        }
    }

    
    @PostMapping
    public ResponseEntity<Apprenant> creerApprenant(@RequestBody Apprenant apprenant) {
        Apprenant nouveau = apprenantService.creerApprenant(apprenant);
        return ResponseEntity.status(HttpStatus.CREATED).body(nouveau);
    }
}