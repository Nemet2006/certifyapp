package az.certifyapp.auth.client;

import az.certifyapp.auth.dto.LoginRequest;
import az.certifyapp.auth.dto.RegisterRequest;
import az.certifyapp.common.enums.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.util.UUID;

@Component
public class UserAccountClient {

    private final RestClient restClient;

    public UserAccountClient(@Value("${certifyapp.user-service.base-url:http://localhost:8082}") String baseUrl) {
        String normalized = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.restClient = RestClient.builder().baseUrl(normalized).build();
    }

    public UserAccountResponse registerSync(RegisterRequest request) {
        try {
            return restClient.post()
                    .uri("/api/v1/users/register-sync")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new RegisterSyncBody(
                            request.email(),
                            request.password(),
                            request.fullName(),
                            request.role() != null ? request.role() : Role.USER
                    ))
                    .retrieve()
                    .body(UserAccountResponse.class);
        } catch (HttpClientErrorException e) {
            throw new IllegalStateException("User service register-sync failed: " + e.getStatusCode(), e);
        }
    }

    public UserAccountResponse login(LoginRequest request) {
        try {
            return restClient.post()
                    .uri("/api/v1/users/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new LoginBody(request.email(), request.password()))
                    .retrieve()
                    .body(UserAccountResponse.class);
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode().value() == 401) {
                throw new InvalidCredentialsException();
            }
            throw new IllegalStateException("User service login failed: " + e.getStatusCode(), e);
        }
    }

    public record UserAccountResponse(UUID id, String email, String fullName, Role role) {
    }

    private record RegisterSyncBody(String email, String password, String fullName, Role role) {
    }

    private record LoginBody(String email, String password) {
    }

    public static class InvalidCredentialsException extends RuntimeException {
    }
}
