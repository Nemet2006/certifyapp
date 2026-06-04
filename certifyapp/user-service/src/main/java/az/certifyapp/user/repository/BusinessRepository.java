package az.certifyapp.user.repository;

import az.certifyapp.user.entity.BusinessEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BusinessRepository extends JpaRepository<BusinessEntity, UUID> {

    Optional<BusinessEntity> findByUser_Id(UUID userId);

    List<BusinessEntity> findByUser_EmailIgnoreCase(String email);
}
