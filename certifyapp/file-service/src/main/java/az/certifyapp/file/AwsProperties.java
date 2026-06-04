package az.certifyapp.file;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "certifyapp.aws")
public record AwsProperties(
        String region,
        String s3Bucket,
        String endpoint,
        String accessKeyId,
        String secretAccessKey
) {
}
