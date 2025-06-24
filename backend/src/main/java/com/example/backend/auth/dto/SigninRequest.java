package com.example.backend.auth.dto;

import lombok.Data;

@Data
public class SigninRequest {
    private String email;
    private String password;
    private Boolean saveDetails;
}
