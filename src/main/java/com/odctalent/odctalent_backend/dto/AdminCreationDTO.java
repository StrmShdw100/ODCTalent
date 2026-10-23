package com.odctalent.odctalent_backend.dto;

import lombok.Data;

@Data
public class AdminCreationDTO {
    private String prenom;
    private String nom;
    private String email;
    private String telephone;
    private String role;
    private String roleAdmin;
    private String motDePasse;
}