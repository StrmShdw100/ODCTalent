package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.dto.MissionRequest;
import com.odctalent.odctalent_backend.dto.MissionResponse;
import com.odctalent.odctalent_backend.service.MissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/missions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MissionController {

    private final MissionService missionService;

    @GetMapping
    public ResponseEntity<List<MissionResponse>> getAllMissions() {
        return ResponseEntity.ok(missionService.getAllMissions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MissionResponse> getMissionById(@PathVariable Long id) {
        return ResponseEntity.ok(missionService.getMissionById(id));
    }

    @PostMapping
    public ResponseEntity<MissionResponse> createMission(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody MissionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(missionService.createMission(userDetails.getUsername(), request));
    }

    // PUT /api/v1/missions/{id}
    @PutMapping("/{id}")
    public ResponseEntity<MissionResponse> updateMission(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody MissionRequest request) {
        return ResponseEntity.ok(missionService.updateMission(id, userDetails.getUsername(), request));
    }

    // DELETE /api/v1/missions/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMission(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        missionService.deleteMission(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}