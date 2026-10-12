package com.odctalent.odctalent_backend.config;

import com.odctalent.odctalent_backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Activation et configuration du CORS directement ici
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // 1. Inscription, Connexion & Documentation Swagger
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/webjars/**").permitAll()// 2. Téléchargement et consultation de fichiers (CV, images)
                        .requestMatchers(HttpMethod.GET, "/api/v1/files/download/**").permitAll()

                        // 3. Consultation publique (Missions, Projets, Portfolios, Avis)
                        .requestMatchers(HttpMethod.GET, "/api/v1/missions/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/projets/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/portfolios/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/avis/**").permitAll()

                        // 4. Suivi post-ODC
                        .requestMatchers("/api/v1/suivi/me/**").hasAnyAuthority("APPRENANT", "ROLE_APPRENANT")
                        .requestMatchers("/api/v1/suivi/admin/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")

                        // 5. Actions réservées aux ADMINISTRATEURS
                        .requestMatchers("/api/v1/admin/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")

                        // 6. Actions réservées aux RECRUTEURS
                        .requestMatchers(HttpMethod.POST, "/api/v1/missions/**").hasAnyAuthority("RECRUTEUR", "ROLE_RECRUTEUR")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/missions/**").hasAnyAuthority("RECRUTEUR", "ROLE_RECRUTEUR")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/missions/**").hasAnyAuthority("RECRUTEUR", "ROLE_RECRUTEUR")
                        .requestMatchers("/api/v1/candidatures/mission/**").hasAnyAuthority("RECRUTEUR", "ROLE_RECRUTEUR")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/candidatures/*/statut").hasAnyAuthority("RECRUTEUR", "ROLE_RECRUTEUR")
                        .requestMatchers(HttpMethod.POST, "/api/v1/avis").hasAnyAuthority("RECRUTEUR", "ROLE_RECRUTEUR")

                        // 7. Actions réservées aux APPRENANTS
                        .requestMatchers(HttpMethod.POST, "/api/v1/candidatures/**").hasAnyAuthority("APPRENANT", "ROLE_APPRENANT")
                        .requestMatchers("/api/v1/candidatures/me").hasAnyAuthority("APPRENANT", "ROLE_APPRENANT")
                        .requestMatchers(HttpMethod.POST, "/api/v1/projets/**").hasAnyAuthority("APPRENANT", "ROLE_APPRENANT")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/projets/**").hasAnyAuthority("APPRENANT", "ROLE_APPRENANT")
                        .requestMatchers("/api/v1/portfolios/me/**").hasAnyAuthority("APPRENANT", "ROLE_APPRENANT")

                        // 8. Upload de fichiers & Messagerie (nécessite d'être authentifié)
                        .requestMatchers(HttpMethod.POST, "/api/v1/files/upload").authenticated()
                        .requestMatchers("/api/v1/messages/**").authenticated()

                        // Tout le reste requiert une authentification
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:4200"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS",
                "PATCH"
        ));

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}