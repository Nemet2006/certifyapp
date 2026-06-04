package az.certifyapp.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AddAttendeeRequest(
        @NotBlank @Email String email,
        String fullName
) {
}
