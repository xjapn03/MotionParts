package com.motionParts.ecommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.motionParts.ecommerce.Models.Role;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    // Buscar un rol por su nombre
    Optional<Role> findByName(String name);

    // Obtener una página de roles
    Page<Role> findAll(Pageable pageable);

    // Eliminar un rol por nombre (opcional)
    void deleteByName(String name);
}