package com.odctalent.odctalent_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class CompleteProfileRequest {
    private String biographie;
    private String experiences;
    private List<String> competences;
    private Boolean disponibilite;
}