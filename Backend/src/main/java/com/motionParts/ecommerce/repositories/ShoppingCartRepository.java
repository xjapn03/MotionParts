package com.motionParts.ecommerce.repositories;

import com.motionParts.ecommerce.Models.ShoppingCart;
import com.motionParts.ecommerce.Models.ShoppingCartStatus;
import com.motionParts.ecommerce.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Long> {

    // ✅ Buscar carritos de un usuario
    List<ShoppingCart> findByUser(User user);

    // ✅ Buscar carritos de un usuario con estado específico
    List<ShoppingCart> findByUserAndStatus(User user, ShoppingCartStatus status);

    Optional<ShoppingCart> findByUserIdAndStatus(Long userId, ShoppingCartStatus status);


    // ✅ Buscar un carrito por ID
    Optional<ShoppingCart> findById(Long id);
}



