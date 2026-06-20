package az.certifyapp.user;

import az.certifyapp.common.enums.Role;
import az.certifyapp.user.controller.AuthAccountController;
import az.certifyapp.user.dto.RegisterSyncRequest;
import az.certifyapp.user.dto.UserResponse;
import az.certifyapp.user.service.AuthAccountService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthAccountController.class)
@Import({az.certifyapp.user.config.PasswordConfig.class, az.certifyapp.user.config.TestSecurityConfig.class})
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthAccountService authAccountService;

    @Test
    @WithMockUser
    void registerSync_success() throws Exception {
        when(authAccountService.registerSync(any()))
                .thenReturn(new UserResponse(UUID.randomUUID(), "new@example.com", "New User", Role.USER));

        RegisterSyncRequest request = new RegisterSyncRequest("new@example.com", "pass123", "New User", Role.USER);

        mockMvc.perform(post("/api/v1/users/register-sync")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("new@example.com"));
    }

    @Test
    @WithMockUser
    void registerSync_invalidEmail_returns400() throws Exception {
        RegisterSyncRequest request = new RegisterSyncRequest("not-an-email", "pass123", "User", Role.USER);

        mockMvc.perform(post("/api/v1/users/register-sync")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void login_success() throws Exception {
        when(authAccountService.login(any()))
                .thenReturn(new UserResponse(UUID.randomUUID(), "login@example.com", "Login User", Role.USER));

        String body = "{\"email\":\"login@example.com\",\"password\":\"pass123\"}";

        mockMvc.perform(post("/api/v1/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("login@example.com"));
    }

    @Test
    @WithMockUser
    void login_wrongPassword_returns401() throws Exception {
        when(authAccountService.login(any()))
                .thenThrow(new az.certifyapp.common.exception.BusinessException(
                        az.certifyapp.common.error.ErrorCode.UNAUTHORIZED, "Email və ya şifrə səhvdir"));

        String body = "{\"email\":\"wrong@example.com\",\"password\":\"wrongpass\"}";

        mockMvc.perform(post("/api/v1/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }
}
