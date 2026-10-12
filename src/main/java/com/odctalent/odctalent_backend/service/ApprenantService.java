package com.odctalent.odctalent_backend.service;

import com.odctalent.odctalent_backend.dto.CompleteProfileRequest;
import com.odctalent.odctalent_backend.entity.Apprenant;
import com.odctalent.odctalent_backend.entity.Profil;
import com.odctalent.odctalent_backend.entity.enums.Role;
import com.odctalent.odctalent_backend.repository.ApprenantRepository;
import com.odctalent.odctalent_backend.repository.ProfilRepository;
import com.odctalent.odctalent_backend.util.ExcelHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApprenantService {

    private final ApprenantRepository apprenantRepository;
    private final ProfilRepository profilRepository; 
    private final PasswordEncoder passwordEncoder;

    private String genererMatriculeCourt() {
        String codeUnique = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "ODC-" + codeUnique;
    }

    @Transactional
    public List<Apprenant> importerApprenantsExcel(MultipartFile file, String promotion) throws IOException {
        List<Apprenant> apprenants = ExcelHelper.excelToApprenants(file.getInputStream(), promotion);

        for (Apprenant apprenant : apprenants) {
            apprenant.setMatricule(genererMatriculeCourt());
            apprenant.setRole(Role.APPRENANT);
            
            if (apprenant.getMotDePasse() == null || apprenant.getMotDePasse().isBlank()) {
                apprenant.setMotDePasse(passwordEncoder.encode("ODC@2026"));
            }
        }

        return apprenantRepository.saveAll(apprenants);
    }

    @Transactional
    public Apprenant creerApprenant(Apprenant apprenant) {
        if (apprenant.getMatricule() == null || apprenant.getMatricule().isBlank()) {
            apprenant.setMatricule(genererMatriculeCourt());
        }
        if (apprenant.getRole() == null) {
            apprenant.setRole(Role.APPRENANT);
        }
        if (apprenant.getMotDePasse() != null && !apprenant.getMotDePasse().startsWith("$2a$")) {
            apprenant.setMotDePasse(passwordEncoder.encode(apprenant.getMotDePasse()));
        }
        return apprenantRepository.save(apprenant);
    }

    @Transactional
    public void completeProfile(String email, CompleteProfileRequest request) {
        Apprenant apprenant = apprenantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Apprenant introuvable avec l'email : " + email));

        if (request.getDisponibilite() != null) {
            apprenant.setDisponibilite(request.getDisponibilite());
        }

        Profil profil = apprenant.getProfil();
        if (profil == null) {
            profil = new Profil();
            profil.setApprenant(apprenant);
        }

        if (request.getBiographie() != null) {
            profil.setBiographie(request.getBiographie());
        }
        if (request.getExperiences() != null) {
            profil.setExperiences(request.getExperiences());
        }
        if (request.getCompetences() != null) {
            profil.setCompetences(request.getCompetences());
        }

        profilRepository.save(profil);
        apprenantRepository.save(apprenant);
    }
}