package az.certifyapp.auth.dto;

import az.certifyapp.common.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank String password,
        String fullName,
        Role role
) {
}
