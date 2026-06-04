package az.certifyapp.user.dto;

import az.certifyapp.common.enums.CertificateAuthStatus;

import java.time.Instant;

public record CertificateVerifyResponse(
        String verificationCode,
        CertificateAuthStatus authStatus,
        boolean found,
        String title,
        String holderName,
        String holderEmail,
        String businessName,
        String eventTitle,
        Instant issuedAt,
        String message
) {
}
