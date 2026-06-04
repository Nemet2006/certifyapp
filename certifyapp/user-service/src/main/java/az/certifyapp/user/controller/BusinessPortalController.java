package az.certifyapp.user.controller;

import az.certifyapp.user.dto.*;
import az.certifyapp.user.service.BusinessPortalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class BusinessPortalController {

    private final BusinessPortalService portalService;

    public BusinessPortalController(BusinessPortalService portalService) {
        this.portalService = portalService;
    }

    @GetMapping("/businesses/by-email/{email}")
    public BusinessResponse businessByEmail(@PathVariable String email) {
        return portalService.findBusinessByUserEmail(email);
    }

    @PostMapping("/businesses/setup")
    @ResponseStatus(HttpStatus.CREATED)
    public BusinessResponse setupBusiness(@RequestBody SetupBusinessRequest request) {
        return portalService.ensureBusinessForUser(request.email(), request.organizationName());
    }

    @GetMapping("/businesses/{businessId}/events")
    public List<EventResponse> listEvents(@PathVariable UUID businessId) {
        return portalService.listEvents(businessId);
    }

    @PostMapping("/businesses/{businessId}/events")
    @ResponseStatus(HttpStatus.CREATED)
    public EventResponse createEvent(
            @PathVariable UUID businessId,
            @Valid @RequestBody CreateEventRequest request
    ) {
        return portalService.createEvent(businessId, request);
    }

    @GetMapping("/events/{eventId}/attendees")
    public List<AttendeeResponse> listAttendees(@PathVariable UUID eventId) {
        return portalService.listAttendees(eventId);
    }

    @PostMapping("/events/{eventId}/attendees")
    @ResponseStatus(HttpStatus.CREATED)
    public AttendeeResponse addAttendee(
            @PathVariable UUID eventId,
            @Valid @RequestBody AddAttendeeRequest request
    ) {
        return portalService.addAttendee(eventId, request);
    }

    @PostMapping("/events/{eventId}/issue-certificates")
    public List<IssuedCertificateResponse> issueCertificates(
            @PathVariable UUID eventId,
            @Valid @RequestBody IssueCertificatesRequest request
    ) {
        return portalService.issueCertificates(eventId, request);
    }

    @GetMapping("/businesses/{businessId}/issued-certificates")
    public List<IssuedCertificateResponse> listCertificates(@PathVariable UUID businessId) {
        return portalService.listIssuedCertificates(businessId);
    }

    @GetMapping("/issued-certificates/verify/{code}")
    public CertificateVerifyResponse verify(@PathVariable String code) {
        return portalService.verifyByCode(code);
    }

    @PostMapping("/businesses/{businessId}/issued-certificates/{certificateId}/authenticate")
    public IssuedCertificateResponse authenticate(
            @PathVariable UUID businessId,
            @PathVariable UUID certificateId
    ) {
        return portalService.authenticateCertificate(businessId, certificateId);
    }

    @PostMapping("/businesses/{businessId}/issued-certificates/{certificateId}/revoke")
    public IssuedCertificateResponse revoke(
            @PathVariable UUID businessId,
            @PathVariable UUID certificateId,
            @RequestBody(required = false) RevokeCertificateRequest request
    ) {
        return portalService.revokeCertificate(
                businessId,
                certificateId,
                request != null ? request : new RevokeCertificateRequest(null)
        );
    }
}
