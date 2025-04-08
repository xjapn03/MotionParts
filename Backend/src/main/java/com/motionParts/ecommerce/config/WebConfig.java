package com.motionParts.ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Carpeta real del sistema de archivos donde se guardarán las imágenes
        Path uploadDir = Paths.get("uploads/products");
        String uploadPath = uploadDir.toFile().getAbsolutePath();

        // Mapea las URL /assets/products/** al sistema de archivos real
        registry.addResourceHandler("/assets/products/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}
