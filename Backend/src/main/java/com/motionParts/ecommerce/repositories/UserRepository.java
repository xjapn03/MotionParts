package com.motionParts.ecommerce.repositories;

//import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.motionParts.ecommerce.Models.User;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Buscar un usuario por su nombre de usuario (username)
    Optional<User> findByUsername(String username);

    // Buscar un usuario por su nombre de usuario y cargar sus roles
    @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.username = :username")
    Optional<User> findByUsernameWithRoles(String username);

    // Buscar un usuario por su correo electrónico 
    Optional<User> findByEmail(String email);
}
