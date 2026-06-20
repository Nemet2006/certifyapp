package az.certifyapp.auth;

import az.certifyapp.auth.dto.RegisterRequest;
import az.certifyapp.auth.dto.LoginRequest;
import az.certifyapp.auth.dto.TokenResponse;
import az.certifyapp.auth.client.UserAccountClient;
import az.certifyapp.auth.client.UserAccountClient.UserAccountResponse;
import az.certifyapp.auth.service.JwtTokenService;
import az.certifyapp.common.enums.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserAccountClient userAccountClient;

    @Test
    void register_success() throws Exception {
        when(userAccountClient.registerSync(any()))
                .thenReturn(new UserAccountResponse(UUID.randomUUID(), "new@example.com", "New User", Role.USER));

        String body = "{\"email\":\"new@example.com\",\"password\":\"pass123\",\"fullName\":\"New User\",\"role\":\"USER\"}";

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated());
    }

    @Test
    void register_invalidEmail_returns400() throws Exception {
        String body = "{\"email\":\"not-an-email\",\"password\":\"pass123\",\"fullName\":\"User\"}";

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_missingPassword_returns400() throws Exception {
        String body = "{\"email\":\"valid@email.com\",\"fullName\":\"User\"}";

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_success() throws Exception {
        when(userAccountClient.login(any()))
                .thenReturn(new UserAccountResponse(UUID.randomUUID(), "login@example.com", "Login User", Role.USER));

        String body = "{\"email\":\"login@example.com\",\"password\":\"pass123\"}";

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());
    }

    @Test
    void login_wrongPassword_returns401() throws Exception {
        when(userAccountClient.login(any()))
                .thenThrow(new UserAccountClient.InvalidCredentialsException());

        String body = "{\"email\":\"wrong@example.com\",\"password\":\"wrongpass\"}";

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void refresh_missingToken_returns400() throws Exception {
        String body = "{}";

        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }
}
