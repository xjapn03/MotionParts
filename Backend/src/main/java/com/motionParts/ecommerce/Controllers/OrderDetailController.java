package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.dto.OrderDetailDTO;
import com.motionParts.ecommerce.services.OrderDetailService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
public class OrderDetailController {

    @Autowired
    private OrderDetailService orderDetailService;

    // ✅ Obtener los detalles de una orden
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderDetailDTO>> getOrderDetails(@PathVariable Long orderId) {
        List<OrderDetailDTO> orderDetails = orderDetailService.getOrderDetailsByOrderId(orderId);
        return ResponseEntity.ok(orderDetails);
    }

    // ✅ Obtener un detalle específico por ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailDTO> getOrderDetailById(@PathVariable Long id) {
        OrderDetailDTO orderDetailDTO = orderDetailService.getOrderDetailById(id);
        return ResponseEntity.ok(orderDetailDTO);
    }
}
