package com.odctalent.odctalent_backend.service;

import com.odctalent.odctalent_backend.entity.Apprenant;
import com.odctalent.odctalent_backend.entity.enums.Role;
import com.odctalent.odctalent_backend.repository.ApprenantRepository;
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
}