package com.motionParts.ecommerce.Models;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "users") // Asegúrate de que coincide con tu tabla en PostgreSQL
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;
    private String username;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;


    // Constructor vacío (necesario para JPA)
    public User() {}

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    //public String getLastName() { return last_name; }
    //public void setLastName(String last_name) { this.last_name = last_name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public LocalDateTime getCreatedDateTime() {return created_at; }

    public LocalDateTime getUpdatedLocalDateTime() {return updated_at; }

}
