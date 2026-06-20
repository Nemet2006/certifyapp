package az.certifyapp.user;

import az.certifyapp.common.enums.Role;
import az.certifyapp.common.exception.ResourceNotFoundException;
import az.certifyapp.user.dto.BusinessResponse;
import az.certifyapp.user.dto.CreateBusinessRequest;
import az.certifyapp.user.dto.CreateUserRequest;
import az.certifyapp.user.dto.UserResponse;
import az.certifyapp.user.repository.BusinessRepository;
import az.certifyapp.user.repository.UserRepository;
import az.certifyapp.user.service.BusinessService;
import az.certifyapp.user.service.UserService;
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

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest(includeFilters = @ComponentScan.Filter(type = FilterType.ANNOTATION, classes = Service.class))
@ActiveProfiles("test")
@Import(PasswordConfig.class)
class BusinessServiceTest {

    @Autowired
    private BusinessService businessService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BusinessRepository businessRepository;

    private UUID userId;

    @BeforeEach
    void setUp() {
        businessRepository.deleteAll();
        userRepository.deleteAll();
        UserResponse user = userService.create(new CreateUserRequest("biz@example.com", "Biz Owner", Role.BUSINESS));
        userId = user.id();
    }

    @Test
    void createBusiness_success() {
        BusinessResponse response = businessService.create(new CreateBusinessRequest(userId, "My Org"));

        assertNotNull(response);
        assertEquals("My Org", response.name());
        assertEquals(userId, response.userId());
        assertFalse(response.verified());
    }

    @Test
    void createBusiness_unknownUser_throwsException() {
        assertThrows(ResourceNotFoundException.class,
                () -> businessService.create(new CreateBusinessRequest(UUID.randomUUID(), "Org")));
    }

    @Test
    void findAll_returnsAllBusinesses() {
        businessService.create(new CreateBusinessRequest(userId, "Org One"));
        businessService.create(new CreateBusinessRequest(userId, "Org Two"));

        List<BusinessResponse> businesses = businessService.findAll();
        assertEquals(2, businesses.size());
    }
}
