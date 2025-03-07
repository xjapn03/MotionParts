package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.dto.LoginRequest;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public String authenticate(LoginRequest request) {
        // Aquí iría la lógica de autenticación real, por ejemplo, verificando en la base de datos.
        // Por ahora, devolvemos un token de prueba.
        
        if ("admin".equals(request.getUsername()) && "password".equals(request.getPassword())) {
            return "fake-jwt-token";
        }
        throw new RuntimeException("Credenciales inválidas");
    }
}
