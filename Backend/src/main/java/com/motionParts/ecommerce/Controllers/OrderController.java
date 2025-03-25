package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.dto.OrderDTO;
import com.motionParts.ecommerce.services.OrderService;
import com.motionParts.ecommerce.Models.OrderStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ✅ Crear una nueva orden desde el carrito de compras
    @PostMapping("/users/{userId}")
    public ResponseEntity<OrderDTO> createOrder(
            @PathVariable Long userId,
            @RequestParam String paymentMethod,
            @RequestParam String pickupLocation) {
        
        OrderDTO orderDTO = orderService.createOrder(userId, paymentMethod, pickupLocation);
        return ResponseEntity.ok(orderDTO);
    }

    // ✅ Obtener todas las órdenes de un usuario
    @GetMapping("/users/{userId}")
    public ResponseEntity<List<OrderDTO>> getUserOrders(@PathVariable Long userId) {
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
