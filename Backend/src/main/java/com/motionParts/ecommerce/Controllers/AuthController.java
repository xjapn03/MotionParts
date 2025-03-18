package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.services.AuthService;
import com.motionParts.ecommerce.dto.LoginRequest;
import com.motionParts.ecommerce.dto.AuthResponse;
import com.motionParts.ecommerce.Models.User; // Importar el modelo User
import com.motionParts.ecommerce.repositories.UserRepository; // Importar UserRepository
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository; // ✅ Agregado para obtener el usuario

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Autenticamos y obtenemos el token
            String token = authService.authenticate(request);

            // ✅ Buscar el usuario autenticado en la base de datos
            Optional<User> userOptional = userRepository.findByUsername(request.getUsername());
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(404).body("Usuario no encontrado");
            }

            User user = userOptional.get();

            // ✅ Respuesta con el token y los datos del usuario
            AuthResponse authResponse = new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                "assets/default-user.png" // Aquí podrías cambiar a una imagen real del usuario si la tienes en la BD
            );

            return ResponseEntity.ok(authResponse);

        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
