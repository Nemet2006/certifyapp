package az.certifyapp.payment.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/print-orders")
public class PrintOrderController {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createStub() {
        return Map.of(
                "id", UUID.randomUUID(),
                "status", "PENDING",
                "message", "Stripe Payment Intent — not implemented"
        );
    }
}
