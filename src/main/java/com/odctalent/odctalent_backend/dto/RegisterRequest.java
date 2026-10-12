package com.odctalent.odctalent_backend.dto;

import com.odctalent.odctalent_backend.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String motDePasse;
    private String role;
    private String photoProfil;
}