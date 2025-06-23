package com.example.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${frontend.urls}")
    private String frontendUrls;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        List<String> origins = Arrays.stream(frontendUrls.split(","))
                .map(String::trim)
                .toList();

        registry.addMapping("/**")
                .allowedOrigins(origins.toArray(new String[0]))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
