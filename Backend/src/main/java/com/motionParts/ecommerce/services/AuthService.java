package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.dto.LoginRequest;
import com.motionParts.ecommerce.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.Optional;
import com.motionParts.ecommerce.Models.User;

@Service
public class AuthService {

     @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String authenticate(LoginRequest request) {
        // Buscar usuario en la BD
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }

        User user = userOptional.get();

        // Comparar contraseña ingresada con la almacenada (si está encriptada)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        // Si es válido, generar un token (simulación por ahora)
        return "fake-jwt-token-for-" + user.getUsername();
    }
}
