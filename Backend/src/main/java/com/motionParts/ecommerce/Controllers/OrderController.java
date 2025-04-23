package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.dto.OrderDTO;
import com.motionParts.ecommerce.services.OrderService;
import com.motionParts.ecommerce.Models.OrderStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ✅ Crear una nueva orden para un usuario logueado
    @PostMapping("/users")
    public ResponseEntity<OrderDTO> createOrder(Authentication authentication, @RequestBody OrderDTO orderDTO) {
        Long userId = (Long) authentication.getDetails();  // Obtener el userId de los detalles de autenticación

        // Log para depurar
        System.out.println("UserId from Authentication: " + userId);  // Ver si el userId está correctamente extraído

        if (userId == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        OrderDTO createdOrder = orderService.createOrder(userId, orderDTO);
        return ResponseEntity.ok(createdOrder);
    }


    // ✅ Crear una nueva orden para un invitado (sin userId)
    @PostMapping("/guests")
    public ResponseEntity<OrderDTO> createGuestOrder(@RequestBody OrderDTO orderDTO) {
        OrderDTO createdOrder = orderService.createGuestOrder(orderDTO);
        return ResponseEntity.ok(createdOrder);
    }

    // ✅ Obtener TODAS las órdenes
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // ✅ Obtener todas las órdenes de un usuario por ID (administrador o casos especiales)
    @GetMapping("/users/{userId}")
    public ResponseEntity<List<OrderDTO>> getUserOrders(@PathVariable Long userId, Authentication authentication) {
        Long currentUserId = (Long) authentication.getDetails(); // Obtener el userId del Authentication

        if (currentUserId == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        // Verificar si el usuario es el mismo que el del token o si es un administrador
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ADMIN"));

        if (!currentUserId.equals(userId) && !isAdmin) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        List<OrderDTO> orders = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(orders);
    }

    // ✅ Obtener una orden por ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        OrderDTO orderDTO = orderService.getOrderById(id);
        return ResponseEntity.ok(orderDTO);
    }

    // ✅ Actualizar el estado de una orden
    @PutMapping("/{id}/update-status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase()); // Convertir String a Enum
            OrderDTO updatedOrder = orderService.updateOrderStatus(id, newStatus);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: Estado de orden inválido. Valores permitidos: PENDING, PAID, SHIPPED, CANCELED.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Error: Orden no encontrada con ID " + id);
        }
    }

    // ✅ Cancelar una orden
    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(@PathVariable Long id) {
        OrderDTO cancelledOrder = orderService.cancelOrder(id);
        return ResponseEntity.ok(cancelledOrder);
    }
}
