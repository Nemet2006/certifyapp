package az.certifyapp.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateBusinessRequest(
        @NotNull UUID userId,
        @NotBlank String name
) {
}
