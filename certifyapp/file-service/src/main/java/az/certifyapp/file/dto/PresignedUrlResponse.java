package az.certifyapp.file.dto;

public record PresignedUrlResponse(
        String url,
        String bucket,
        String key
) {
}
