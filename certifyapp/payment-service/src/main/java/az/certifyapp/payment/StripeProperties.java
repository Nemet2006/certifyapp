package az.certifyapp.payment;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "certifyapp.stripe")
public record StripeProperties(
        String apiKey,
        String webhookSecret
) {
}
