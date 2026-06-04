package az.certifyapp.notification.listener;

import az.certifyapp.notification.config.RabbitMqConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class EmailQueueListener {

    private static final Logger log = LoggerFactory.getLogger(EmailQueueListener.class);

    @RabbitListener(queues = RabbitMqConfig.EMAIL_QUEUE)
    public void handleEmailMessage(String payload) {
        log.info("Received email job (stub): {}", payload);
    }
}
