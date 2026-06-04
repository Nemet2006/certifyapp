package az.certifyapp.certificate.service;

import az.certifyapp.certificate.config.RabbitMqConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class CertificateService {

    private final RabbitTemplate rabbitTemplate;

    public CertificateService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void enqueuePdfGeneration(UUID participationId) {
        rabbitTemplate.convertAndSend(
                RabbitMqConfig.PDF_GENERATION_QUEUE,
                Map.of("participationId", participationId.toString())
        );
    }
}
