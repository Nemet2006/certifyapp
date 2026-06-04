package az.certifyapp.file.controller;

import az.certifyapp.file.AwsProperties;
import az.certifyapp.file.dto.PresignedUrlResponse;
import az.certifyapp.file.service.S3FileService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/files")
public class FileController {

    private final S3FileService s3FileService;
    private final AwsProperties awsProperties;

    public FileController(S3FileService s3FileService, AwsProperties awsProperties) {
        this.s3FileService = s3FileService;
        this.awsProperties = awsProperties;
    }

    @GetMapping("/presigned-upload")
    public PresignedUrlResponse presignedUpload(@RequestParam String key) {
        return s3FileService.createUploadUrl(awsProperties.s3Bucket(), key);
    }
}
