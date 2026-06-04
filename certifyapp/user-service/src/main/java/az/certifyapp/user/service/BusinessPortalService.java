package az.certifyapp.user.service;

import az.certifyapp.common.enums.CertificateAuthStatus;
import az.certifyapp.common.enums.ParticipationStatus;
import az.certifyapp.common.enums.Role;
import az.certifyapp.common.exception.ResourceNotFoundException;
import az.certifyapp.user.dto.*;
import az.certifyapp.user.entity.*;
import az.certifyapp.user.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class BusinessPortalService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final BusinessRepository businessRepository;
    private final EventRepository eventRepository;
    private final ParticipationRepository participationRepository;
    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;

    public BusinessPortalService(
            BusinessRepository businessRepository,
            EventRepository eventRepository,
            ParticipationRepository participationRepository,
            CertificateRepository certificateRepository,
            UserRepository userRepository
    ) {
        this.businessRepository = businessRepository;
        this.eventRepository = eventRepository;
        this.participationRepository = participationRepository;
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public BusinessResponse findBusinessByUserEmail(String email) {
        return businessRepository.findByUser_EmailIgnoreCase(email).stream()
                .findFirst()
                .map(b -> new BusinessResponse(b.getId(), b.getUser().getId(), b.getName(), b.isVerified()))
                .orElseThrow(() -> new ResourceNotFoundException("Business not found for: " + email));
    }

    @Transactional(readOnly = true)
    public BusinessEntity requireBusiness(UUID businessId) {
        return businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found: " + businessId));
    }

    @Transactional
    public BusinessResponse ensureBusinessForUser(String email, String orgName) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserEntity u = new UserEntity();
                    u.setEmail(email);
                    u.setRole(Role.BUSINESS);
                    return userRepository.save(u);
                });

        BusinessEntity business = businessRepository.findByUser_Id(user.getId())
                .orElseGet(() -> {
                    BusinessEntity b = new BusinessEntity();
                    b.setUser(user);
                    b.setName(orgName != null && !orgName.isBlank() ? orgName : "Təşkilatım");
                    b.setVerified(false);
                    return businessRepository.save(b);
                });

        return new BusinessResponse(business.getId(), user.getId(), business.getName(), business.isVerified());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> listEvents(UUID businessId) {
        requireBusiness(businessId);
        return eventRepository.findByBusiness_IdOrderByEndDateDesc(businessId).stream()
                .map(this::toEventResponse)
                .toList();
    }

    @Transactional
    public EventResponse createEvent(UUID businessId, CreateEventRequest request) {
        BusinessEntity business = requireBusiness(businessId);
        EventEntity event = new EventEntity();
        event.setBusiness(business);
        event.setTitle(request.title());
        event.setDescription(request.description());
        event.setEndDate(request.endDate());
        return toEventResponse(eventRepository.save(event));
    }

    @Transactional(readOnly = true)
    public List<AttendeeResponse> listAttendees(UUID eventId) {
        EventEntity event = requireEvent(eventId);
        return participationRepository.findByEventIdOrderByCreatedAtDesc(event.getId()).stream()
                .map(this::toAttendeeResponse)
                .toList();
    }

    @Transactional
    public AttendeeResponse addAttendee(UUID eventId, AddAttendeeRequest request) {
        EventEntity event = requireEvent(eventId);
        String email = request.email().trim();
        UserEntity user = userRepository.findByEmailIgnoreCase(email)
                .orElseGet(() -> {
                    UserEntity u = new UserEntity();
                    u.setEmail(email);
                    u.setFullName(request.fullName());
                    u.setRole(Role.USER);
                    return userRepository.save(u);
                });

        if (request.fullName() != null && !request.fullName().isBlank() && user.getFullName() == null) {
            user.setFullName(request.fullName());
        }

        ParticipationEntity participation = participationRepository
                .findByEventIdAndUserId(event.getId(), user.getId())
                .orElseGet(() -> {
                    ParticipationEntity p = new ParticipationEntity();
                    p.setEvent(event);
                    p.setUser(user);
                    p.setStatus(ParticipationStatus.COMPLETED);
                    return participationRepository.save(p);
                });

        participation.setStatus(ParticipationStatus.COMPLETED);
        return toAttendeeResponse(participationRepository.save(participation));
    }

    @Transactional
    public List<IssuedCertificateResponse> issueCertificates(UUID eventId, IssueCertificatesRequest request) {
        EventEntity event = requireEvent(eventId);
        BusinessEntity business = event.getBusiness();
        List<ParticipationEntity> targets = resolveIssueTargets(event, request);

        List<IssuedCertificateResponse> issued = new ArrayList<>();
        String titleBase = request.certificateTitle() != null && !request.certificateTitle().isBlank()
                ? request.certificateTitle()
                : event.getTitle() + " sertifikatı";

        for (ParticipationEntity p : targets) {
            if (certificateRepository.existsByParticipation_Id(p.getId())) {
                continue;
            }
            CertificateEntity cert = new CertificateEntity();
            cert.setParticipation(p);
            cert.setUser(p.getUser());
            cert.setBusiness(business);
            cert.setEvent(event);
            cert.setTitle(titleBase);
            cert.setVerificationCode(generateCode());
            cert.setHolderName(p.getUser().getFullName() != null ? p.getUser().getFullName() : p.getUser().getEmail());
            cert.setHolderEmail(p.getUser().getEmail());
            cert.setAuthStatus(CertificateAuthStatus.ISSUED);
            cert.setIssuedAt(Instant.now());
            cert.setHash(hashCode(cert.getVerificationCode(), business.getId(), p.getUser().getId()));
            issued.add(toCertificateResponse(certificateRepository.save(cert)));
        }
        return issued;
    }

    @Transactional(readOnly = true)
    public List<IssuedCertificateResponse> listIssuedCertificates(UUID businessId) {
        requireBusiness(businessId);
        return certificateRepository.findByBusiness_IdOrderByIssuedAtDesc(businessId).stream()
                .map(this::toCertificateResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CertificateVerifyResponse verifyByCode(String code) {
        String normalized = code.trim().toUpperCase();
        return certificateRepository.findByVerificationCode(normalized)
                .map(this::toVerifyResponse)
                .orElseGet(() -> new CertificateVerifyResponse(
                        normalized,
                        null,
                        false,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        "Bu kod sistemdə tapılmadı — saxta ola bilər"
                ));
    }

    @Transactional
    public IssuedCertificateResponse authenticateCertificate(UUID businessId, UUID certificateId) {
        CertificateEntity cert = requireBusinessCertificate(businessId, certificateId);
        cert.setAuthStatus(CertificateAuthStatus.AUTHENTIC);
        cert.setVerifiedAt(Instant.now());
        cert.setRevokedReason(null);
        return toCertificateResponse(certificateRepository.save(cert));
    }

    @Transactional
    public IssuedCertificateResponse revokeCertificate(UUID businessId, UUID certificateId, RevokeCertificateRequest request) {
        CertificateEntity cert = requireBusinessCertificate(businessId, certificateId);
        cert.setAuthStatus(CertificateAuthStatus.REVOKED);
        cert.setRevokedReason(request.reason() != null ? request.reason() : "Saxta və ya etibarsız sertifikat");
        cert.setVerifiedAt(Instant.now());
        return toCertificateResponse(certificateRepository.save(cert));
    }

    private List<ParticipationEntity> resolveIssueTargets(EventEntity event, IssueCertificatesRequest request) {
        if (Boolean.TRUE.equals(request.issueToAllCompleted())) {
            return participationRepository.findByEventIdOrderByCreatedAtDesc(event.getId()).stream()
                    .filter(p -> p.getStatus() == ParticipationStatus.COMPLETED)
                    .toList();
        }
        if (request.participationIds() != null && !request.participationIds().isEmpty()) {
            return request.participationIds().stream()
                    .map(participationRepository::findById)
                    .filter(java.util.Optional::isPresent)
                    .map(java.util.Optional::get)
                    .filter(p -> p.getEvent().getId().equals(event.getId()))
                    .toList();
        }
        throw new IllegalArgumentException("participationIds və ya issueToAllCompleted tələb olunur");
    }

    private EventEntity requireEvent(UUID eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + eventId));
    }

    private CertificateEntity requireBusinessCertificate(UUID businessId, UUID certificateId) {
        CertificateEntity cert = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found: " + certificateId));
        if (cert.getBusiness() == null || !cert.getBusiness().getId().equals(businessId)) {
            throw new ResourceNotFoundException("Certificate not in business scope");
        }
        return cert;
    }

    private EventResponse toEventResponse(EventEntity event) {
        List<ParticipationEntity> attendees = participationRepository.findByEventIdOrderByCreatedAtDesc(event.getId());
        long certs = certificateRepository.findByEvent_IdOrderByIssuedAtDesc(event.getId()).size();
        return new EventResponse(
                event.getId(),
                event.getBusiness().getId(),
                event.getTitle(),
                event.getDescription(),
                event.getEndDate(),
                attendees.size(),
                (int) certs
        );
    }

    private AttendeeResponse toAttendeeResponse(ParticipationEntity p) {
        boolean issued = certificateRepository.existsByParticipation_Id(p.getId());
        String code = certificateRepository.findByParticipation_Id(p.getId())
                .map(CertificateEntity::getVerificationCode)
                .orElse(null);
        return new AttendeeResponse(
                p.getId(),
                p.getUser().getId(),
                p.getUser().getEmail(),
                p.getUser().getFullName(),
                p.getStatus(),
                issued,
                code
        );
    }

    private IssuedCertificateResponse toCertificateResponse(CertificateEntity cert) {
        return new IssuedCertificateResponse(
                cert.getId(),
                cert.getVerificationCode(),
                cert.getTitle(),
                cert.getHolderName(),
                cert.getHolderEmail(),
                cert.getEvent() != null ? cert.getEvent().getTitle() : null,
                cert.getBusiness() != null ? cert.getBusiness().getName() : null,
                cert.getAuthStatus(),
                cert.getIssuedAt(),
                cert.getVerifiedAt(),
                cert.getRevokedReason()
        );
    }

    private CertificateVerifyResponse toVerifyResponse(CertificateEntity cert) {
        String message = switch (cert.getAuthStatus()) {
            case AUTHENTIC -> "Təşkilat təsdiqləyib: bu sertifikat həqiqidir";
            case ISSUED -> "Verilib — təşkilat hələ rəsmi təsdiq verməyib";
            case REVOKED -> "Ləğv edilib: " + (cert.getRevokedReason() != null ? cert.getRevokedReason() : "saxta və ya etibarsız");
        };
        return new CertificateVerifyResponse(
                cert.getVerificationCode(),
                cert.getAuthStatus(),
                true,
                cert.getTitle(),
                cert.getHolderName(),
                cert.getHolderEmail(),
                cert.getBusiness() != null ? cert.getBusiness().getName() : null,
                cert.getEvent() != null ? cert.getEvent().getTitle() : null,
                cert.getIssuedAt(),
                message
        );
    }

    private static String generateCode() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder sb = new StringBuilder("CERT-");
        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(RANDOM.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private static String hashCode(String code, UUID businessId, UUID userId) {
        return Integer.toHexString((code + businessId + userId).hashCode());
    }
}
