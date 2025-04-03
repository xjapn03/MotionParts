package com.motionParts.ecommerce.dto;

import java.util.Set;

public class RoleDTO {
    private Long id;
    private String name;
    private Set<Long> users; // Lista de IDs de usuarios con este rol

    public RoleDTO() {}

    public RoleDTO(Long id, String name, Set<Long> users) {
        this.id = id;
        this.name = name;
        this.users = users;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Set<Long> getUsers() { return users; }
    public void setUsers(Set<Long> users) { this.users = users; }
}