package az.certifyapp.certificate.controller;

import az.certifyapp.certificate.dto.CertificateStubResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/certificates")
public class CertificateController {

    @GetMapping
    public List<CertificateStubResponse> list() {
        return List.of(
                new CertificateStubResponse(UUID.randomUUID(), "STUB", null, "demo-certificate-1"),
                new CertificateStubResponse(UUID.randomUUID(), "STUB", null, "demo-certificate-2")
        );
    }

    @GetMapping("/{id}")
    public CertificateStubResponse get(@PathVariable UUID id) {
        return new CertificateStubResponse(id, "STUB", null, "not-implemented");
    }

    @PostMapping("/generate/{participationId}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public CertificateStubResponse generate(@PathVariable UUID participationId) {
        return new CertificateStubResponse(UUID.randomUUID(), "QUEUED", participationId, "PDF generation queued");
    }
}
