package az.certifyapp.user.service;

import az.certifyapp.common.exception.ResourceNotFoundException;
import az.certifyapp.user.dto.BusinessResponse;
import az.certifyapp.user.dto.CreateBusinessRequest;
import az.certifyapp.user.entity.BusinessEntity;
import az.certifyapp.user.entity.UserEntity;
import az.certifyapp.user.repository.BusinessRepository;
import az.certifyapp.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class BusinessService {

    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;

    public BusinessService(BusinessRepository businessRepository, UserRepository userRepository) {
        this.businessRepository = businessRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<BusinessResponse> findAll() {
        return businessRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public BusinessResponse create(CreateBusinessRequest request) {
        UserEntity user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.userId()));
        BusinessEntity entity = new BusinessEntity();
        entity.setUser(user);
        entity.setName(request.name());
        entity.setVerified(false);
        return toResponse(businessRepository.save(entity));
    }

    private BusinessResponse toResponse(BusinessEntity entity) {
        return new BusinessResponse(
                entity.getId(),
                entity.getUser().getId(),
                entity.getName(),
                entity.isVerified()
        );
    }
}
