package az.certifyapp.user.service;

import az.certifyapp.common.enums.Role;
import az.certifyapp.common.error.ErrorCode;
import az.certifyapp.common.exception.BusinessException;
import az.certifyapp.user.dto.LoginCredentialsRequest;
import az.certifyapp.user.dto.RegisterSyncRequest;
import az.certifyapp.user.dto.UserResponse;
import az.certifyapp.user.entity.UserEntity;
import az.certifyapp.user.repository.UserRepository;
import az.certifyapp.user.util.EmailNormalizer;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthAccountService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthAccountService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse registerSync(RegisterSyncRequest request) {
        String email = EmailNormalizer.normalize(request.email());
        Role role = request.role() != null ? request.role() : Role.USER;

        UserEntity user = userRepository.findByEmailIgnoreCase(email)
                .orElseGet(() -> {
                    UserEntity created = new UserEntity();
                    created.setEmail(email);
                    created.setRole(role);
                    return created;
                });

        user.setEmail(email);
        user.setRole(role);
        if (request.fullName() != null && !request.fullName().isBlank()) {
            user.setFullName(request.fullName().trim());
        }
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        return toResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public UserResponse login(LoginCredentialsRequest request) {
        String email = EmailNormalizer.normalize(request.email());
        UserEntity user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED, "Email və ya şifrə səhvdir"));

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Email və ya şifrə səhvdir");
        }
        return toResponse(user);
    }

    private static UserResponse toResponse(UserEntity entity) {
        return new UserResponse(
                entity.getId(),
                entity.getEmail(),
                entity.getFullName(),
                entity.getRole()
        );
    }
}
