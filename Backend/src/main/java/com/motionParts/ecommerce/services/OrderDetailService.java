package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.Models.Order;
import com.motionParts.ecommerce.Models.OrderDetail;
import com.motionParts.ecommerce.Models.Product;
import com.motionParts.ecommerce.dto.OrderDetailDTO;
import com.motionParts.ecommerce.repositories.OrderDetailRepository;
import com.motionParts.ecommerce.repositories.OrderRepository;
import com.motionParts.ecommerce.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderDetailService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    // ✅ Obtener los detalles de una orden en formato DTO
    public List<OrderDetailDTO> getOrderDetailsByOrderId(Long orderId) {
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(orderId);
        return orderDetails.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // ✅ Obtener un detalle específico por ID
    public OrderDetailDTO getOrderDetailById(Long id) {
        OrderDetail orderDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Detalle de orden no encontrado con ID: " + id));
        return convertToDTO(orderDetail);
    }

    // ✅ Agregar un detalle a una orden
    public OrderDetailDTO addOrderDetail(Long orderId, Long productId, int quantity, double unitPrice) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada con ID: " + orderId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + productId));

        OrderDetail orderDetail = new OrderDetail(order, product, quantity, unitPrice);
        orderDetail = orderDetailRepository.save(orderDetail);

        return convertToDTO(orderDetail);
    }

    private OrderDetailDTO convertToDTO(OrderDetail orderDetail) {
        return new OrderDetailDTO(
                orderDetail.getId(),
                orderDetail.getOrder().getId(),
                orderDetail.getProduct().getId(),
                orderDetail.getProduct().getName(),
                orderDetail.getQuantity(),
                orderDetail.getUnitPrice(),
                orderDetail.getSubtotal()
        );
    }
}
