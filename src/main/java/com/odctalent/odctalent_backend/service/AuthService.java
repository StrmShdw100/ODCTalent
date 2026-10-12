package com.odctalent.odctalent_backend.service;

import com.odctalent.odctalent_backend.dto.AuthResponse;
import com.odctalent.odctalent_backend.dto.LoginRequest;
import com.odctalent.odctalent_backend.dto.RegisterRequest;
import com.odctalent.odctalent_backend.entity.Apprenant;
import com.odctalent.odctalent_backend.entity.Portfolio;
import com.odctalent.odctalent_backend.entity.Recruteur;
import com.odctalent.odctalent_backend.entity.Utilisateur;
import com.odctalent.odctalent_backend.entity.enums.Role;
import com.odctalent.odctalent_backend.repository.ApprenantRepository;
import com.odctalent.odctalent_backend.repository.PortfolioRepository;
import com.odctalent.odctalent_backend.repository.RecruteurRepository;
import com.odctalent.odctalent_backend.repository.UtilisateurRepository;
import com.odctalent.odctalent_backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final ApprenantRepository apprenantRepository;
    private final RecruteurRepository recruteurRepository;
    private final PortfolioRepository portfolioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà.");
        }

        Role userRole = request.getRole() != null ? request.getRole() : Role.APPRENANT;

        Utilisateur user;

        if (userRole == Role.RECRUTEUR) {
            Recruteur recruteur = new Recruteur();
            recruteur.setNom(request.getNom());
            recruteur.setPrenom(request.getPrenom());
            recruteur.setEmail(request.getEmail());
            recruteur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
            recruteur.setTelephone(request.getTelephone());
            recruteur.setRole(Role.RECRUTEUR);
            // actif = false et statut = "EN_ATTENTE" par défaut
            user = recruteurRepository.save(recruteur);
        } else {

            


            Apprenant apprenant = new Apprenant();
            apprenant.setNom(request.getNom());
            apprenant.setPrenom(request.getPrenom());
            apprenant.setEmail(request.getEmail());
            apprenant.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
            apprenant.setTelephone(request.getTelephone());
            apprenant.setRole(Role.APPRENANT);
            // actif = false et statut = "EN_ATTENTE" par défaut
            user = apprenantRepository.save(apprenant);

            // Créer automatiquement un portfolio vide pour le nouvel apprenant
            Portfolio portfolio = Portfolio.builder()
                    .apprenant((Apprenant) user)
                    .build();
            portfolioRepository.save(portfolio);
        }

        // Envoi de l'e-mail de bienvenue
        emailService.sendWelcomeEmail(user.getEmail(), user.getPrenom());

        return AuthResponse.builder()
                .token(null) 
                .email(user.getEmail())
                .role(user.getRole().name())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getMotDePasse()
                )
        );

        var user = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));

        if (!user.isActif()) {
            throw new RuntimeException("Votre compte est en attente de validation par un administrateur.");
        }

        var userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        var jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .build();
    }
}