package az.certifyapp.auth.controller;

import az.certifyapp.auth.AuthJwtProperties;
import az.certifyapp.auth.dto.LoginRequest;
import az.certifyapp.auth.dto.RegisterRequest;
import az.certifyapp.auth.dto.TokenResponse;
import az.certifyapp.auth.service.JwtTokenService;
import az.certifyapp.common.enums.Role;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final JwtTokenService jwtTokenService;
    private final AuthJwtProperties jwtProperties;

    public AuthController(JwtTokenService jwtTokenService, AuthJwtProperties jwtProperties) {
        this.jwtTokenService = jwtTokenService;
        this.jwtProperties = jwtProperties;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public TokenResponse register(@Valid @RequestBody RegisterRequest request) {
        UUID userId = UUID.randomUUID();
        Role role = request.role() != null ? request.role() : Role.USER;
        return issueTokens(userId, request.email(), role);
    }

    @PostMapping("/login")
    public TokenResponse login(@Valid @RequestBody LoginRequest request) {
        UUID userId = UUID.nameUUIDFromBytes(request.email().getBytes());
        return issueTokens(userId, request.email(), Role.USER);
    }

    @PostMapping("/refresh")
    public TokenResponse refresh(@RequestBody Map<String, String> body) {
        String refresh = body.get("refreshToken");
        if (refresh == null || refresh.isBlank()) {
            throw new IllegalArgumentException("refreshToken is required");
        }
        UUID userId = UUID.randomUUID();
        return issueTokens(userId, "user@certifyapp.local", Role.USER);
    }

    private TokenResponse issueTokens(UUID userId, String email, Role role) {
        String access = jwtTokenService.createAccessToken(userId, email, role);
        String refresh = jwtTokenService.createRefreshToken(userId);
        return TokenResponse.of(access, refresh, jwtProperties.accessTtlMinutes() * 60);
    }
}
