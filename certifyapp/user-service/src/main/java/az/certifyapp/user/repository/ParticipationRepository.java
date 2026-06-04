package az.certifyapp.user.repository;

import az.certifyapp.user.entity.ParticipationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ParticipationRepository extends JpaRepository<ParticipationEntity, UUID> {

    List<ParticipationEntity> findByEventIdOrderByCreatedAtDesc(UUID eventId);

    Optional<ParticipationEntity> findByEventIdAndUserId(UUID eventId, UUID userId);
}
