package az.certifyapp.user.repository;

import az.certifyapp.user.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<EventEntity, UUID> {

    List<EventEntity> findByBusiness_IdOrderByEndDateDesc(UUID businessId);
}
