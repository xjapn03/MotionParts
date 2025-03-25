package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.dto.OrderDTO;
import com.motionParts.ecommerce.services.OrderService;
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
    public ResponseEntity<OrderDTO> createOrder(@PathVariable Long userId) {
        OrderDTO orderDTO = orderService.createOrder(userId);
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
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        OrderDTO updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }

    // ✅ Cancelar una orden
    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(@PathVariable Long id) {
        OrderDTO cancelledOrder = orderService.cancelOrder(id);
        return ResponseEntity.ok(cancelledOrder);
    }
}
