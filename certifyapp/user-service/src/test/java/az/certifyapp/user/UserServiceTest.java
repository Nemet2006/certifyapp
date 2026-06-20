package az.certifyapp.user;

import az.certifyapp.common.enums.Role;
import az.certifyapp.common.exception.ResourceNotFoundException;
import az.certifyapp.user.dto.CreateUserRequest;
import az.certifyapp.user.dto.UserResponse;
import az.certifyapp.user.entity.UserEntity;
import az.certifyapp.user.repository.UserRepository;
import az.certifyapp.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Service;
import org.springframework.test.context.ActiveProfiles;
import az.certifyapp.user.config.PasswordConfig;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest(includeFilters = @ComponentScan.Filter(type = FilterType.ANNOTATION, classes = Service.class))
@ActiveProfiles("test")
@Import(PasswordConfig.class)
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestEntityManager entityManager;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void createUser_success() {
        CreateUserRequest request = new CreateUserRequest("test@example.com", "Test User", Role.USER);
        UserResponse response = userService.create(request);

        assertNotNull(response);
        assertEquals("test@example.com", response.email());
        assertEquals("Test User", response.fullName());
        assertEquals(Role.USER, response.role());
        assertNotNull(response.id());
    }

    @Test
    void createUser_duplicateEmail_throwsException() {
        CreateUserRequest request = new CreateUserRequest("dup@example.com", "User One", Role.USER);
        userService.create(request);

        CreateUserRequest duplicate = new CreateUserRequest("dup@example.com", "User Two", Role.USER);
        assertThrows(IllegalArgumentException.class, () -> userService.create(duplicate));
    }

    @Test
    void findAll_returnsAllUsers() {
        userService.create(new CreateUserRequest("a@example.com", "A", Role.USER));
        userService.create(new CreateUserRequest("b@example.com", "B", Role.BUSINESS));

        List<UserResponse> users = userService.findAll();
        assertEquals(2, users.size());
    }

    @Test
    void findById_success() {
        UserResponse created = userService.create(new CreateUserRequest("find@example.com", "Find Me", Role.USER));
        UserResponse found = userService.findById(created.id());

        assertEquals(created.id(), found.id());
        assertEquals("find@example.com", found.email());
    }

    @Test
    void findById_notFound_throwsException() {
        assertThrows(ResourceNotFoundException.class, () -> userService.findById(UUID.randomUUID()));
    }
}
