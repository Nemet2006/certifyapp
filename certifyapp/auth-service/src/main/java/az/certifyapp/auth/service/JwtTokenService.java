package az.certifyapp.auth.service;

import az.certifyapp.auth.AuthJwtProperties;
import az.certifyapp.common.constants.JwtClaimKeys;
import az.certifyapp.common.enums.Role;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtTokenService {

    private final AuthJwtProperties properties;

    public JwtTokenService(AuthJwtProperties properties) {
        this.properties = properties;
    }

    public String createAccessToken(UUID userId, String email, Role role) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(properties.accessTtlMinutes() * 60);
        return Jwts.builder()
                .issuer(properties.issuer())
                .subject(userId.toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .claim(JwtClaimKeys.EMAIL, email)
                .claim(JwtClaimKeys.ROLE, role.name())
                .claim(JwtClaimKeys.USER_ID, userId.toString())
                .signWith(secretKey())
                .compact();
    }

    public String createRefreshToken(UUID userId) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(properties.refreshTtlDays() * 24 * 3600);
        return Jwts.builder()
                .issuer(properties.issuer())
                .subject(userId.toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .claim("type", "refresh")
                .signWith(secretKey())
                .compact();
    }

    private SecretKey secretKey() {
        byte[] keyBytes = properties.secret().getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            byte[] padded = new byte[32];
            System.arraycopy(keyBytes, 0, padded, 0, Math.min(keyBytes.length, 32));
            return Keys.hmacShaKeyFor(padded);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
