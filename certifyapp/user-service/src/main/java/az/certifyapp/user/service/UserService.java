package az.certifyapp.user.service;

import az.certifyapp.common.enums.Role;
import az.certifyapp.common.exception.ResourceNotFoundException;
import az.certifyapp.user.dto.CreateUserRequest;
import az.certifyapp.user.dto.UserResponse;
import az.certifyapp.user.entity.UserEntity;
import az.certifyapp.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UserResponse findById(UUID id) {
        return userRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    @Transactional
    public UserResponse create(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered");
        }
        UserEntity entity = new UserEntity();
        entity.setEmail(request.email());
        entity.setFullName(request.fullName());
        entity.setRole(request.role() != null ? request.role() : Role.USER);
        return toResponse(userRepository.save(entity));
    }

    private UserResponse toResponse(UserEntity entity) {
        return new UserResponse(
                entity.getId(),
                entity.getEmail(),
                entity.getFullName(),
                entity.getRole()
        );
    }
}
