package az.certifyapp.notification.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    public static final String EMAIL_QUEUE = "notification.email";

    @Bean
    Queue emailQueue() {
        return new Queue(EMAIL_QUEUE, true);
    }
}
