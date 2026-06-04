package az.certifyapp.certificate.dto;

import java.util.UUID;

public record CertificateStubResponse(
        UUID id,
        String status,
        UUID participationId,
        String message
) {
}
