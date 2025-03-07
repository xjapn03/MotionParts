package com.motionParts.ecommerce.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Deshabilitar CSRF en APIs REST
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**", "/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .logout(logout -> logout.permitAll());
    
        return http.build();
    }
    
}
