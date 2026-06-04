package az.certifyapp.auth.controller;

import az.certifyapp.auth.AuthJwtProperties;
import az.certifyapp.auth.client.UserAccountClient;
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
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final JwtTokenService jwtTokenService;
    private final AuthJwtProperties jwtProperties;
    private final UserAccountClient userAccountClient;

    public AuthController(
            JwtTokenService jwtTokenService,
            AuthJwtProperties jwtProperties,
            UserAccountClient userAccountClient
    ) {
        this.jwtTokenService = jwtTokenService;
        this.jwtProperties = jwtProperties;
        this.userAccountClient = userAccountClient;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public TokenResponse register(@Valid @RequestBody RegisterRequest request) {
        var account = userAccountClient.registerSync(request);
        return issueTokens(account.id(), account.email(), account.role());
    }

    @PostMapping("/login")
    public TokenResponse login(@Valid @RequestBody LoginRequest request) {
        try {
            var account = userAccountClient.login(request);
            return issueTokens(account.id(), account.email(), account.role());
        } catch (UserAccountClient.InvalidCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email və ya şifrə səhvdir");
        }
    }

    @PostMapping("/refresh")
    public TokenResponse refresh(@RequestBody Map<String, String> body) {
        String refresh = body.get("refreshToken");
        if (refresh == null || refresh.isBlank()) {
            throw new IllegalArgumentException("refreshToken is required");
        }
        var claims = jwtTokenService.parseRefreshClaims(refresh);
        return issueTokens(claims.userId(), claims.email(), claims.role());
    }

    private TokenResponse issueTokens(java.util.UUID userId, String email, Role role) {
        String access = jwtTokenService.createAccessToken(userId, email, role);
        String refresh = jwtTokenService.createRefreshToken(userId, email, role);
        return TokenResponse.of(access, refresh, jwtProperties.accessTtlMinutes() * 60);
    }
}
