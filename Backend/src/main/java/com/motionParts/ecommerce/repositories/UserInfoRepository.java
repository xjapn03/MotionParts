package com.motionParts.ecommerce.repositories;

import com.motionParts.ecommerce.Models.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {

    // Buscar la información del usuario por su ID de usuario
    Optional<UserInfo> findByUserId(Long userId);
    
    // Si quieres agregar alguna consulta personalizada, también puedes usar anotaciones @Query
    // Ejemplo: Buscar UserInfo por correo electrónico
    // @Query("SELECT ui FROM UserInfo ui WHERE ui.email = :email")
    // Optional<UserInfo> findByEmail(String email);
}
