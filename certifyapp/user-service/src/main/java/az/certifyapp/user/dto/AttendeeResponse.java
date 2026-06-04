package az.certifyapp.user.dto;

import az.certifyapp.common.enums.ParticipationStatus;

import java.util.UUID;

public record AttendeeResponse(
        UUID participationId,
        UUID userId,
        String email,
        String fullName,
        ParticipationStatus status,
        boolean certificateIssued,
        String verificationCode
) {
}
