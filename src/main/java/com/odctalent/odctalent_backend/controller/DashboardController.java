package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.dto.DashboardStatsDTO;
import com.odctalent.odctalent_backend.entity.enums.Role;
import com.odctalent.odctalent_backend.repository.UtilisateurRepository;
import com.odctalent.odctalent_backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UtilisateurRepository utilisateurRepository;

    // GET /api/v1/admin/dashboard/stats
    @GetMapping("/dashboard/stats") 
    public ResponseEntity<DashboardStatsDTO> getStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    // GET /api/v1/admin/apprenants/stats
    @GetMapping("/apprenants/stats")
    public ResponseEntity<Map<String, Object>> getApprenantsStatsForAdmin() {
        long totalInscrits = utilisateurRepository.countByRole(Role.APPRENANT);

        Map<String, Object> stats = new HashMap<>();
        stats.put("inscrits", totalInscrits);
        stats.put("suivis", totalInscrits); 
        stats.put("enEmploi", "0%");
        stats.put("enRecherche", "100%");

        return ResponseEntity.ok(stats);
    }

    // GET /api/v1/admin/recruteurs/notifications
    @GetMapping("/recruteurs/notifications")
    public ResponseEntity<List<Object>> getRecruteursNotifications() {
        return ResponseEntity.ok(new ArrayList<>());
    }
}