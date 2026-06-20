package az.certifyapp.user;

import az.certifyapp.common.enums.Role;
import az.certifyapp.common.exception.BusinessException;
import az.certifyapp.user.dto.LoginCredentialsRequest;
import az.certifyapp.user.dto.RegisterSyncRequest;
import az.certifyapp.user.dto.UserResponse;
import az.certifyapp.user.repository.UserRepository;
import az.certifyapp.user.service.AuthAccountService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Service;
import org.springframework.test.context.ActiveProfiles;
import az.certifyapp.user.config.PasswordConfig;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest(includeFilters = @ComponentScan.Filter(type = FilterType.ANNOTATION, classes = Service.class))
@ActiveProfiles("test")
@Import(PasswordConfig.class)
class AuthAccountServiceTest {

    @Autowired
    private AuthAccountService authAccountService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void registerSync_createsNewUser() {
        RegisterSyncRequest request = new RegisterSyncRequest("new@example.com", "password123", "New User", Role.USER);
        UserResponse response = authAccountService.registerSync(request);

        assertNotNull(response);
        assertEquals("new@example.com", response.email());
        assertEquals("New User", response.fullName());
        assertEquals(Role.USER, response.role());
    }

    @Test
    void registerSync_existingUser_updatesRole() {
        authAccountService.registerSync(new RegisterSyncRequest("existing@example.com", "pass123", "Existing", Role.USER));

        UserResponse updated = authAccountService.registerSync(
                new RegisterSyncRequest("existing@example.com", "pass123", "Existing", Role.BUSINESS));
        assertEquals(Role.BUSINESS, updated.role());
    }

    @Test
    void login_success() {
        authAccountService.registerSync(new RegisterSyncRequest("login@example.com", "pass123", "Login User", Role.USER));

        UserResponse response = authAccountService.login(new LoginCredentialsRequest("login@example.com", "pass123"));
        assertNotNull(response);
        assertEquals("login@example.com", response.email());
    }

    @Test
    void login_wrongPassword_throwsException() {
        authAccountService.registerSync(new RegisterSyncRequest("wrong@example.com", "pass123", "User", Role.USER));

        assertThrows(BusinessException.class,
                () -> authAccountService.login(new LoginCredentialsRequest("wrong@example.com", "wrongpass")));
    }

    @Test
    void login_unknownEmail_throwsException() {
        assertThrows(BusinessException.class,
                () -> authAccountService.login(new LoginCredentialsRequest("unknown@example.com", "pass123")));
    }
}
