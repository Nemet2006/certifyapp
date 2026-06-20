package az.certifyapp.auth;

import az.certifyapp.auth.AuthJwtProperties;
import az.certifyapp.auth.service.JwtTokenService;
import az.certifyapp.common.enums.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenServiceTest {

    private JwtTokenService jwtTokenService;

    @BeforeEach
    void setUp() {
        AuthJwtProperties props = new AuthJwtProperties(
                "certifyapp",
                "test-secret-key-that-is-at-least-256-bits-long-for-hmac-sha256",
                15,
                7
        );
        jwtTokenService = new JwtTokenService(props);
    }

    @Test
    void createAccessToken_containsUserIdAndRole() {
        UUID userId = UUID.randomUUID();
        String token = jwtTokenService.createAccessToken(userId, "test@example.com", Role.USER);

        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    @Test
    void createRefreshToken_containsUserId() {
        UUID userId = UUID.randomUUID();
        String token = jwtTokenService.createRefreshToken(userId, "test@example.com", Role.BUSINESS);

        assertNotNull(token);

        var claims = jwtTokenService.parseRefreshClaims(token);
        assertEquals(userId, claims.userId());
        assertEquals("test@example.com", claims.email());
        assertEquals(Role.BUSINESS, claims.role());
    }

    @Test
    void parseInvalidToken_throwsException() {
        assertThrows(Exception.class, () -> jwtTokenService.parseRefreshClaims("invalid.token.here"));
    }

    @Test
    void differentRoles_produceDifferentTokens() {
        UUID userId = UUID.randomUUID();
        String userToken = jwtTokenService.createAccessToken(userId, "t@t.com", Role.USER);
        String bizToken = jwtTokenService.createAccessToken(userId, "t@t.com", Role.BUSINESS);

        assertNotEquals(userToken, bizToken);
    }

    @Test
    void accessToken_notAValidRefreshToken() {
        UUID userId = UUID.randomUUID();
        String accessToken = jwtTokenService.createAccessToken(userId, "t@t.com", Role.USER);

        assertThrows(Exception.class, () -> jwtTokenService.parseRefreshClaims(accessToken));
    }
}
