package az.certifyapp.auth.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;

/**
 * JWT blacklist storage — implement revoke/logout in a later phase.
 * Render (pulsuz) Redis olmadan işləyir — yalnız Redis mövcud olanda aktivdir.
 */
@Configuration
@ConditionalOnBean(RedisConnectionFactory.class)
public class RedisConfig {

    @Bean
    StringRedisTemplate stringRedisTemplate(RedisConnectionFactory connectionFactory) {
        return new StringRedisTemplate(connectionFactory);
    }
}
