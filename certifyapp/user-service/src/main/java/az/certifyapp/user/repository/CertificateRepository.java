package az.certifyapp.user.repository;

import az.certifyapp.user.entity.CertificateEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CertificateRepository extends JpaRepository<CertificateEntity, UUID> {

    Optional<CertificateEntity> findByVerificationCode(String verificationCode);

    List<CertificateEntity> findByBusiness_IdOrderByIssuedAtDesc(UUID businessId);

    List<CertificateEntity> findByEvent_IdOrderByIssuedAtDesc(UUID eventId);

    boolean existsByParticipation_Id(UUID participationId);

    Optional<CertificateEntity> findByParticipation_Id(UUID participationId);
}
