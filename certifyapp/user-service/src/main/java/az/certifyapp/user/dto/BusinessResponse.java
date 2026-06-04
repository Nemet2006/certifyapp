package az.certifyapp.user.dto;

import java.util.UUID;

public record BusinessResponse(
        UUID id,
        UUID userId,
        String name,
        boolean verified
) {
}
