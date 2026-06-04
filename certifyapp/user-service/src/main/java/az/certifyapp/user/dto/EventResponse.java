package az.certifyapp.user.dto;

import java.time.Instant;
import java.util.UUID;

public record EventResponse(
        UUID id,
        UUID businessId,
        String title,
        String description,
        Instant endDate,
        int attendeeCount,
        int certificatesIssued
) {
}
