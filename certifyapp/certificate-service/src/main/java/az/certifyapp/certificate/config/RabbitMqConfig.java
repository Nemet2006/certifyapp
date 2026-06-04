package az.certifyapp.certificate.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    public static final String PDF_GENERATION_QUEUE = "certificate.pdf.generation";

    @Bean
    Queue pdfGenerationQueue() {
        return new Queue(PDF_GENERATION_QUEUE, true);
    }
}
