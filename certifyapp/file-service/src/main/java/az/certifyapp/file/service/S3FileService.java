package az.certifyapp.file.service;

import az.certifyapp.file.dto.PresignedUrlResponse;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;

@Service
public class S3FileService {

    private final S3Presigner s3Presigner;

    public S3FileService(S3Presigner s3Presigner) {
        this.s3Presigner = s3Presigner;
    }

    public PresignedUrlResponse createUploadUrl(String bucket, String key) {
        var putRequest = PutObjectRequest.builder().bucket(bucket).key(key).build();
        var presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(15))
                .putObjectRequest(putRequest)
                .build();
        var presigned = s3Presigner.presignPutObject(presignRequest);
        return new PresignedUrlResponse(presigned.url().toString(), bucket, key);
    }
}
