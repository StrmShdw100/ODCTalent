package com.odctalent.odctalent_backend.service;

import com.odctalent.odctalent_backend.entity.Recruteur;
import com.odctalent.odctalent_backend.entity.enums.Role;
import com.odctalent.odctalent_backend.repository.RecruteurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecruteurService {

    private final RecruteurRepository recruteurRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Recruteur> listerTous() {
        return recruteurRepository.findAll();
    }

    public Recruteur creerRecruteur(Recruteur recruteur) {
        if (recruteur.getMotDePasse() == null || recruteur.getMotDePasse().isEmpty()) {
            recruteur.setMotDePasse(passwordEncoder.encode("Recruteur@2026"));
        } else {
            recruteur.setMotDePasse(passwordEncoder.encode(recruteur.getMotDePasse()));
        }

        recruteur.setRole(Role.RECRUTEUR);
        recruteur.setActif(false);
        if (recruteur.getStatut() == null) {
            recruteur.setStatut("EN_ATTENTE");
        }

        return recruteurRepository.save(recruteur);
    }

    public void autoriserRecruteur(Long id) {
        Recruteur recruteur = recruteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recruteur introuvable avec l'id : " + id));
        recruteur.setActif(true);
        recruteur.setStatut("VALIDE");
        recruteurRepository.save(recruteur);
    }
}