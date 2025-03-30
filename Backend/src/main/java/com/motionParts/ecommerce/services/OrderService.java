package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.Models.*;
import com.motionParts.ecommerce.dto.BillingDataDTO;
import com.motionParts.ecommerce.dto.OrderDTO;
import com.motionParts.ecommerce.dto.OrderDetailDTO;
import com.motionParts.ecommerce.dto.ShippingDataDTO;
import com.motionParts.ecommerce.repositories.OrderDetailRepository;
import com.motionParts.ecommerce.repositories.OrderRepository;
import com.motionParts.ecommerce.repositories.ShoppingCartRepository;
import com.motionParts.ecommerce.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ShoppingCartRepository shoppingCartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    // ✅ Obtener todas las órdenes de un usuario
    public List<OrderDTO> getOrdersByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));

        List<Order> orders = orderRepository.findByUser(user);
        return orders.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // ✅ Buscar orden por ID
    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada con ID: " + orderId));
        return convertToDTO(order);
    }

    // ✅ Crear una orden a partir del carrito
    public OrderDTO createOrder(Long userId, OrderDTO orderDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
    
        // 🔹 Validar y asignar un valor predeterminado a pickupLocation si es null o vacío
        if (orderDTO.getPickupLocation() == null || orderDTO.getPickupLocation().trim().isEmpty()) {
            orderDTO.setPickupLocation("default_location");
        }
    
        // Buscar carrito activo
        ShoppingCart cart = shoppingCartRepository.findByUserAndStatus(user, ShoppingCartStatus.ACTIVE)
                .stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No se encontró un carrito activo para el usuario"));
    
        // Calcular total del pedido
        double total = cart.getCartItems().stream()
                .mapToDouble(item -> item.getQuantity() * item.getUnitPrice())
                .sum();
    
        // ✅ Validar que `billingData` y `shippingData` existan en `orderDTO`
        BillingData billingData = (orderDTO.getBillingData() != null) ? new BillingData(orderDTO.getBillingData()) : null;
        ShippingData shippingData = (orderDTO.getShippingData() != null) ? new ShippingData(orderDTO.getShippingData()) : null;
    
        // ✅ Crear la orden sin reasignar `order`
        Order newOrder = new Order(user, cart, total, orderDTO.getPaymentMethod(), orderDTO.getPickupLocation(),
                                   billingData, shippingData, orderDTO.getCouponCode(), orderDTO.getShippingMethod(),
                                   orderDTO.getAcceptedTerms());
        orderRepository.save(newOrder);  // ✅ Guardamos la orden
    
        // ✅ Crear y guardar los detalles de la orden
        List<OrderDetail> orderDetails = cart.getCartItems().stream().map(cartItem -> 
            new OrderDetail(newOrder, cartItem.getProduct(), cartItem.getQuantity(), cartItem.getUnitPrice())
        ).collect(Collectors.toList());
    
        orderDetailRepository.saveAll(orderDetails);
    
        // ✅ Actualizar carrito como completado
        cart.setStatus(ShoppingCartStatus.COMPLETED);
        shoppingCartRepository.save(cart);
    
        return convertToDTO(newOrder);
    }

    // ✅ Cambiar estado de una orden
    public OrderDTO updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada con ID: " + orderId));

        order.setStatus(newStatus);
        orderRepository.save(order);
        return convertToDTO(order);
    }

    // ✅ Cancelar una orden
    public OrderDTO cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada con ID: " + orderId));

        order.setStatus(OrderStatus.CANCELED);
        orderRepository.save(order);
        return convertToDTO(order);
    }

    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(order -> new OrderDTO(order)).toList();
    }
    

    // ✅ Convertir `Order` a `OrderDTO`
    private OrderDTO convertToDTO(Order order) {
        List<OrderDetailDTO> orderDetails = order.getOrderDetails().stream()
                .map(detail -> new OrderDetailDTO(
                        detail.getId(),
                        order.getId(),
                        detail.getProduct().getId(),
                        detail.getProduct().getName(),
                        detail.getQuantity(),
                        detail.getUnitPrice(),
                        detail.getSubtotal()
                )).collect(Collectors.toList());

        // ✅ Validar si `BillingData` y `ShippingData` no son null
        BillingDataDTO billingDataDTO = (order.getBillingData() != null) ? new BillingDataDTO(order.getBillingData()) : null;
        ShippingDataDTO shippingDataDTO = (order.getShippingData() != null) ? new ShippingDataDTO(order.getShippingData()) : null;

        return new OrderDTO(
        order.getId(),
        (order.getUser() != null) ? order.getUser().getId() : null,
        orderDetails,
        order.getStatus().name(),
        order.getTotal(),
        order.getPaymentMethod(),
        order.getPickupLocation(),
        order.getCreatedAt(),
        billingDataDTO,
        shippingDataDTO,
        order.getCouponCode(),   // ✅ Agregado
        order.getShippingMethod(), // ✅ Agregado
        order.getAcceptedTerms()  // ✅ Agregado
        );
    }
}
