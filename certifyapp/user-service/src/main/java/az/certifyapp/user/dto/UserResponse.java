package az.certifyapp.user.dto;

import az.certifyapp.common.enums.Role;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String fullName,
        Role role
) {
}
