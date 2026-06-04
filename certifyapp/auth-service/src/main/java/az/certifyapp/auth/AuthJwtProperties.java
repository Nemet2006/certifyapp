package az.certifyapp.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "certifyapp.jwt")
public record AuthJwtProperties(
        String issuer,
        String secret,
        long accessTtlMinutes,
        long refreshTtlDays
) {
}
