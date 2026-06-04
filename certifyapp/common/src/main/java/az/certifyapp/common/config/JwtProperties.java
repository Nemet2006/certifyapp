package az.certifyapp.common.config;

public record JwtProperties(
        String issuer,
        String secret,
        long accessTtlMinutes,
        long refreshTtlDays
) {
    public static JwtProperties defaults() {
        return new JwtProperties("certifyapp", "change-me", 15L, 7L);
    }
}
