package com.motionParts.ecommerce.Models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    // Relación Many-to-Many con User
    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY) 
    @JsonBackReference // Evita la serialización recursiva
    private Set<User> users = new HashSet<>();

    // Constructor por defecto necesario para JPA
    public Role() {}

    // Constructor con parámetros para inicializar el nombre del rol
    public Role(String name) {
        this.name = name;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Set<User> getUsers() { return users; }
    public void setUsers(Set<User> users) { this.users = users; }

    // Sobrescribir equals y hashCode para comparar correctamente las entidades basadas en el ID
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Role role = (Role) o;
        return id != null && id.equals(role.id); // Compara basado en el ID
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0; // Utiliza el ID para el hashCode
    }
}