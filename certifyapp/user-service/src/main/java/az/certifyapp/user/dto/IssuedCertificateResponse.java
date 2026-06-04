package az.certifyapp.user.dto;

import az.certifyapp.common.enums.CertificateAuthStatus;

import java.time.Instant;
import java.util.UUID;

public record IssuedCertificateResponse(
        UUID id,
        String verificationCode,
        String title,
        String holderName,
        String holderEmail,
        String eventTitle,
        String businessName,
        CertificateAuthStatus authStatus,
        Instant issuedAt,
        Instant verifiedAt,
        String revokedReason
) {
}
