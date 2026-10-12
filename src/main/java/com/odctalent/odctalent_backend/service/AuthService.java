package com.odctalent.odctalent_backend.service;
import com.odctalent.odctalent_backend.dto.AuthResponse;
import com.odctalent.odctalent_backend.dto.LoginRequest;
import com.odctalent.odctalent_backend.dto.RegisterRequest;
import com.odctalent.odctalent_backend.entity.*;
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
        System.out.println("=== VALEUR BRUTE DU RÔLE REÇU : " + request.getRole() + " ===");

        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà.");
        }

        Role userRole = Role.APPRENANT;
        if (request.getRole() != null && !request.getRole().trim().isEmpty()) {
            try {
                userRole = Role.valueOf(request.getRole().trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                System.out.println("Rôle inconnu reçu, bascule sur APPRENANT par défaut.");
            }
        }

        Utilisateur user;

        if (userRole == Role.RECRUTEUR) {
            Recruteur recruteur = new Recruteur();
            recruteur.setNom(request.getNom());
            recruteur.setPrenom(request.getPrenom());
            recruteur.setEmail(request.getEmail());
            recruteur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
            recruteur.setTelephone(request.getTelephone());
            recruteur.setRole(Role.RECRUTEUR);
            recruteur.setActif(false);
            user = recruteurRepository.save(recruteur);

        } else if (userRole == Role.ADMIN) {
            Administrateur admin = new Administrateur();
            admin.setNom(request.getNom());
            admin.setPrenom(request.getPrenom());
            admin.setEmail(request.getEmail());
            admin.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
            admin.setTelephone(request.getTelephone());
            admin.setRole(Role.ADMIN);
            admin.setActif(true);
            user = utilisateurRepository.save(admin); // <--- On utilise utilisateurRepository ici directement
        } else {
            Apprenant apprenant = new Apprenant();
            apprenant.setNom(request.getNom());
            apprenant.setPrenom(request.getPrenom());
            apprenant.setEmail(request.getEmail());
            apprenant.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
            apprenant.setTelephone(request.getTelephone());
            apprenant.setRole(Role.APPRENANT);
            apprenant.setActif(false);
            user = apprenantRepository.save(apprenant);

            Portfolio portfolio = Portfolio.builder()
                    .apprenant((Apprenant) user)
                    .build();
            portfolioRepository.save(portfolio);
        }

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