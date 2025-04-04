package com.motionParts.ecommerce.dto;  // Solo esta línea debe existir

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.util.Set;
//USerimport javax.validation.Valid;

public class UserDTO {
    private Long id;  // Declarar el campo id que falta

    @NotNull(message = "Username is required")
    private String username;

    @Email(message = "Email should be valid")
    private String email;

    @NotNull(message = "Password is required")
    private String password;

    private Set<Long> roleId; // Corregido el nombre a roleId (para que coincida con los getters y setters)

    public UserDTO() {}

    public UserDTO(Long id, String username, String email, String password, Set<Long> roleId) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.roleId = roleId;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Set<Long> getRoleId() { return roleId; }  // Asegúrate de que el nombre sea roleId
    public void setRoleId(Set<Long> roleId) { this.roleId = roleId; } // Y aquí también
}