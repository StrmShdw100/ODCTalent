package com.odctalent.odctalent_backend.config;

import com.odctalent.odctalent_backend.entity.Administrateur;
import com.odctalent.odctalent_backend.entity.Apprenant;
import com.odctalent.odctalent_backend.entity.Recruteur;
import com.odctalent.odctalent_backend.entity.enums.Role;
import com.odctalent.odctalent_backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Vérifie si la base est vide pour éviter de dupliquer les comptes à chaque redémarrage
        if (utilisateurRepository.count() == 0) {
            
            // 1. Compte Super Administrateur
            Administrateur superAdmin = new Administrateur();
            superAdmin.setNom("Admin");
            superAdmin.setPrenom("Super");
            superAdmin.setEmail("superadmin@odctalent.com");
            superAdmin.setMotDePasse(passwordEncoder.encode("Admin123!"));
            superAdmin.setTelephone("77000000");
            superAdmin.setRole(Role.ADMIN);
            superAdmin.setRoleAdmin("Super Administrateur");
            superAdmin.setActif(true);
            superAdmin.setStatut("ACTIF");
            superAdmin.setDateInscription(LocalDateTime.now());
            utilisateurRepository.save(superAdmin);

            // 2. Compte Recruteur
            Recruteur recruteur = new Recruteur();
            recruteur.setNom("Kalanso");
            recruteur.setPrenom("Orange Digital");
            recruteur.setEmail("recruteur@odctalent.com");
            recruteur.setMotDePasse(passwordEncoder.encode("Recruteur123!"));
            recruteur.setTelephone("77111111");
            recruteur.setRole(Role.RECRUTEUR);
            recruteur.setActif(true);
            recruteur.setStatut("ACTIF");
            recruteur.setDateInscription(LocalDateTime.now());
            utilisateurRepository.save(recruteur);

            // 3. Compte Apprenant
            Apprenant apprenant = new Apprenant();
            apprenant.setNom("Diallo");
            apprenant.setPrenom("Mamadou");
            apprenant.setEmail("apprenant@odctalent.com");
            apprenant.setMotDePasse(passwordEncoder.encode("Apprenant123!"));
            apprenant.setTelephone("77222222");
            apprenant.setRole(Role.APPRENANT);
            apprenant.setActif(true);
            apprenant.setStatut("ACTIF");
            apprenant.setDateInscription(LocalDateTime.now());
            utilisateurRepository.save(apprenant);

            System.out.println(">>> 3 comptes de test (SuperAdmin, Recruteur, Apprenant) ont été insérés avec succès !");
        }
    }
}