package az.certifyapp.notification.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    @PostMapping("/test")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public Map<String, String> enqueueTest() {
        return Map.of("status", "queued", "message", "Notification dispatch stub");
    }
}
