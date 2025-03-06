package com.motionParts.ecommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.motionParts.ecommerce.Models.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username); // Buscar usuario por username
}