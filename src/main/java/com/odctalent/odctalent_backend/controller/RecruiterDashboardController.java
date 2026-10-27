package com.odctalent.odctalent_backend.controller;

import com.odctalent.odctalent_backend.dto.RecruiterStatsDto;
import com.odctalent.odctalent_backend.service.RecruiterDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/recruteur/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecruiterDashboardController {

    private final RecruiterDashboardService recruiterDashboardService;

    @GetMapping("/stats")
    public ResponseEntity<RecruiterStatsDto> getStats(@AuthenticationPrincipal UserDetails userDetails) {
        RecruiterStatsDto stats = recruiterDashboardService.getStats(userDetails.getUsername());
        return ResponseEntity.ok(stats);
    }
}