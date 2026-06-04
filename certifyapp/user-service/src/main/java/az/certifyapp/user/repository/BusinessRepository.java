package az.certifyapp.user.repository;

import az.certifyapp.user.entity.BusinessEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BusinessRepository extends JpaRepository<BusinessEntity, UUID> {
}
