package com.motionParts.ecommerce.dto;

public class AuthResponse {
    private String token;
    private Long id;
    private String username;
    private String email;
    private String image;

    public AuthResponse(String token, Long id, String username, String email, String image) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.image = image;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
