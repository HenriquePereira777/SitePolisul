package com.polisual.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDTO {

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;

        @NotBlank
        @Size(min = 8, max = 100)
        private String senha;
    }

    @Data
    public static class LoginResponse {
        private String token;
        private String tipo = "Bearer";
        private String email;
        private String role;
        private long expiresIn;

        public LoginResponse(String token, String email, String role, long expiresIn) {
            this.token = token;
            this.email = email;
            this.role = role;
            this.expiresIn = expiresIn;
        }
    }
}
