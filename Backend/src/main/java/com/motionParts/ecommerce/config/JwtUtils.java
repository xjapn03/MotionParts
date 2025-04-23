package com.motionParts.ecommerce.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    private final Key signingKey;
    private final long jwtExpiration;

    public JwtUtils(@Value("${app.jwt.secret}") String jwtSecret, @Value("${app.jwt.expiration}") long jwtExpiration) {
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        this.jwtExpiration = jwtExpiration;
    }

    // Generar un token JWT
    public String generateToken(String username, String role, Long userId) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .claim("userId", userId) // Agregar el userId aquí
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // Validar un token JWT
    public boolean validateJwtToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(signingKey).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // Manejo de excepciones, invalidación del token
            return false;
        }
    }

    // Obtener el nombre de usuario desde el token JWT
    public String getUserNameFromJwtToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(signingKey).build().parseClaimsJws(token).getBody();
        return claims.getSubject();
    }

    // Obtener el userId desde el token JWT
    public Long getUserIdFromJwtToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(signingKey).build().parseClaimsJws(token).getBody();
        System.out.println("Claims: " + claims);  // Imprimir los claims
        return claims.get("userId", Long.class);
    }

    // Obtener el rol desde el token JWT
    public String getRoleFromJwtToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(signingKey).build().parseClaimsJws(token).getBody();
        return claims.get("role", String.class);  // Aquí obtenemos el rol desde los claims
    }

    // Verificar si el token contiene un rol específico
    public boolean hasRole(String token, String role) {
        String userRole = getRoleFromJwtToken(token);
        return userRole != null && userRole.equals(role);  // Compara el rol del token con el rol requerido
    }
}
