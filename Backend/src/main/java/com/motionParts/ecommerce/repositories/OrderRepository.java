package com.motionParts.ecommerce.repositories;

import com.motionParts.ecommerce.Models.Order;
import com.motionParts.ecommerce.Models.OrderStatus;
import com.motionParts.ecommerce.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // ✅ Buscar órdenes de un usuario
    List<Order> findByUser(User user);

    // ✅ Buscar órdenes de un usuario con estado específico
    List<Order> findByUserAndStatus(User user, OrderStatus status);

    // ✅ Buscar órdenes por estado
    List<Order> findByStatus(OrderStatus status);

    // ✅ Buscar orden por ID
    Optional<Order> findById(Long id);
}
