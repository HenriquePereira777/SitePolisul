package com.polisual.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

public class ContatoDTO {

    @Data
    public static class Request {

        @NotBlank(message = "Nome é obrigatório")
        @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
        @Pattern(regexp = "^[\\p{L}\\s.'-]+$", message = "Nome contém caracteres inválidos")
        private String nome;

        @NotBlank(message = "E-mail é obrigatório")
        @Email(message = "E-mail inválido")
        @Size(max = 150)
        private String email;

        @Pattern(regexp = "^[\\d\\s()+-]*$", message = "Telefone inválido")
        @Size(max = 20)
        private String telefone;

        @Size(max = 100, message = "Nome da empresa muito longo")
        private String empresa;

        @NotBlank(message = "Mensagem é obrigatória")
        @Size(min = 10, max = 2000, message = "Mensagem deve ter entre 10 e 2000 caracteres")
        private String mensagem;
    }

    @Data
    public static class Response {
        private Long id;
        private String nome;
        private String email;
        private String empresa;
        private String mensagem;
        private String criadoEm;
    }
}
