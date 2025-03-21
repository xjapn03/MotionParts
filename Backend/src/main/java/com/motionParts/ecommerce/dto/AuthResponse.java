package com.motionParts.ecommerce.dto;

import java.util.Set;
import com.motionParts.ecommerce.Models.Role; // Importa la entidad Role

public class AuthResponse {
    private String token;
    private Long id;
    private String username;
    private String email;
    private String image;
    private Set<Role> roles; // Agregar roles a la respuesta

    public AuthResponse(String token, Long id, String username, String email, String image, Set<Role> roles) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.image = image;
        this.roles = roles;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
}