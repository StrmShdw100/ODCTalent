package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.dto.DashboardStatsDTO;
import com.odctalent.odctalent_backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    // GET /api/v1/admin/dashboard/stats
    @GetMapping("/dashboard/stats") 
    public ResponseEntity<DashboardStatsDTO> getStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    // GET /api/v1/admin/recruteurs/notifications
    @GetMapping("/recruteurs/notifications")
    public ResponseEntity<List<Object>> getRecruteursNotifications() {
        return ResponseEntity.ok(new ArrayList<>());
    }
}