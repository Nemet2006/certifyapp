package az.certifyapp.user.dto;

import az.certifyapp.common.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterSyncRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6) String password,
        String fullName,
        Role role
) {
}
