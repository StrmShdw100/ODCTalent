package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.dto.MissionRequest;
import com.odctalent.odctalent_backend.dto.MissionResponse;
import com.odctalent.odctalent_backend.service.MissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminMissionController {

    private final MissionService missionService;

    @GetMapping("/missions")
    public ResponseEntity<List<MissionResponse>> getAllMissions() {
        return ResponseEntity.ok(missionService.getAllMissions());
    }

    @GetMapping("/stats/opportunites")
    public ResponseEntity<Map<String, Object>> getOpportunitesStats() {
        List<MissionResponse> missions = missionService.getAllMissions();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("recruteursActifs", 12); // Valeur ou calcul dynamique selon tes recruteurs
        stats.put("candidatures", 45);     // Valeur ou calcul dynamique
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/missions")
    public ResponseEntity<MissionResponse> createMissionAdmin(
            @RequestBody MissionRequest request,
            @RequestParam(required = false) Long recruteurId) {
        
        MissionResponse created = missionService.createMissionAdmin(request, recruteurId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/missions/{id}/statut")
    public ResponseEntity<MissionResponse> updateMissionStatus(
            @PathVariable Long id,
            @RequestParam String statut) {
        MissionResponse updated = missionService.updateMissionStatus(id, statut);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/missions/{id}")
    public ResponseEntity<Void> deleteMission(@PathVariable Long id) {
        missionService.deleteMissionAdmin(id);
        return ResponseEntity.noContent().build();
    }
}