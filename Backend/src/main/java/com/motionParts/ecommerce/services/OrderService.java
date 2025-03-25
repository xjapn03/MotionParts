import com.motionParts.ecommerce.Models.*;
import com.motionParts.ecommerce.dto.OrderDTO;
import com.motionParts.ecommerce.dto.OrderDetailDTO;
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

    // ✅ Obtener todas las órdenes de un usuario
    public List<OrderDTO> getOrdersByUser(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // ✅ Buscar orden por ID
    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada con ID: " + orderId));
        return convertToDTO(order);
    }

    // ✅ Crear una orden a partir del carrito
    public OrderDTO createOrder(Long userId, String paymentMethod, String pickupLocation) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));

        // Buscar carrito activo
        ShoppingCart cart = shoppingCartRepository.findByUserAndStatus(user, ShoppingCartStatus.ACTIVE)
                .stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No se encontró un carrito activo para el usuario"));

        // Calcular total del pedido
        double total = cart.getCartItems().stream()
                .mapToDouble(item -> item.getQuantity() * item.getUnitPrice())
                .sum();

        // Crear y guardar la orden
        Order order = new Order(user, cart, total, paymentMethod, pickupLocation);
        order = orderRepository.save(order);

        // Marcar carrito como completado
        cart.setStatus(ShoppingCartStatus.COMPLETED);
        shoppingCartRepository.save(cart);

        return convertToDTO(order);
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

    // ✅ Convertir `Order` a `OrderDTO`
    private OrderDTO convertToDTO(Order order) {
        List<OrderDetailDTO> orderDetails = order.getOrderDetails().stream()
                .map(detail -> new OrderDetailDTO(
                        detail.getId(),
                        order.getId(),
                        detail.getProductId(),
                        "Nombre del producto", // 🔹 Se debe obtener el nombre del producto desde otra fuente
                        detail.getQuantity(),
                        detail.getUnitPrice(),
                        detail.getSubtotal()
                )).collect(Collectors.toList());

        return new OrderDTO(
                order.getId(),
                order.getUser().getId(),
                orderDetails,
                order.getStatus().name(),
                order.getTotal(),
                order.getPaymentMethod(),
                order.getPickupLocation(),
                order.getCreatedAt()
        );
    }
}
