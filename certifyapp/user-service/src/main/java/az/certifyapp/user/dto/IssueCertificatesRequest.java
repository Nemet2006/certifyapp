package az.certifyapp.user.dto;

import java.util.List;
import java.util.UUID;

public record IssueCertificatesRequest(
        List<UUID> participationIds,
        Boolean issueToAllCompleted,
        String certificateTitle
) {
}
