package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.entity.Apprenant;
import com.odctalent.odctalent_backend.repository.ApprenantRepository;
import com.odctalent.odctalent_backend.service.ApprenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/apprenants")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") 
public class AdminApprenantController {

    private final ApprenantService apprenantService;
    private final ApprenantRepository apprenantRepository; 

    @GetMapping("/tous")
    public ResponseEntity<List<Apprenant>> getAllApprenants() {
        List<Apprenant> apprenants = apprenantRepository.findAll();
        return ResponseEntity.ok(apprenants);
    }

    @GetMapping("/stats")
    public ResponseEntity getStats() {
        List<Apprenant> apprenants = apprenantRepository.findAll();
        long total = apprenants.size();

        long enRechercheCount = apprenants.stream()
                .filter(a -> a.getDisponible() != null && a.getDisponible())
                .count();

        long enEmploiCount = total - enRechercheCount;

        String tauxEmploi = "0%";
        String tauxRecherche = "0%";

        if (total > 0) {
            long pctEmploi = (enEmploiCount * 100) / total;
            long pctRecherche = 100 - pctEmploi;
            tauxEmploi = pctEmploi + "%";
            tauxRecherche = pctRecherche + "%";
        }

        Map<String, String> stats = new HashMap<>();
        stats.put("inscrits", String.valueOf(total));
        stats.put("suivis", String.valueOf(total));
        stats.put("enEmploi", tauxEmploi);
        stats.put("enRecherche", tauxRecherche);

        return ResponseEntity.ok(stats);
    }

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