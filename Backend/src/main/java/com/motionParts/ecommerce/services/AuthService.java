package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.dto.LoginRequest;
import com.motionParts.ecommerce.dto.RegisterRequest;
import com.motionParts.ecommerce.Models.User;
import com.motionParts.ecommerce.Models.Role;
import com.motionParts.ecommerce.repositories.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.BadCredentialsException;

import java.security.Key;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

     @Autowired
    private UserService userService;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Key signingKey;
    private final long jwtExpiration;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       @Value("${app.jwt.secret}") String jwtSecret, 
                       @Value("${app.jwt.expiration}") long jwtExpiration) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes()); // ✅ Uso correcto de HS256
        this.jwtExpiration = jwtExpiration;
    }

    public String authenticate(LoginRequest request) {
        // Buscar usuario en la BD
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("El usuario no existe"));

        // Comparar contraseña ingresada con la almacenada
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("La contraseña es incorrecta");
        }

        // Generar JWT con roles
        return generateToken(user);
    }

    public User register(RegisterRequest request) {
        return userService.createUser(request.getUser(), request.getUserInfo());
    }

    private String generateToken(User user) {
        Set<String> roles = user.getRoles().stream()
                                .map(Role::getName)
                                .collect(Collectors.toSet());

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("roles", roles) // ✅ Agregamos roles al token
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isAdmin(User user) {
        return user.getRoles().stream()
                .anyMatch(role -> "ADMIN".equals(role.getName()));
    }
}
