package com.motionParts.ecommerce.Models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true) // 🔹 Puede ser null si el usuario es invitado
    private User user;

    @OneToOne
    @JoinColumn(name = "cart_id", nullable = false) // 🔹 Se asocia con un carrito de compras
    private ShoppingCart shoppingCart;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // 🔹 Para evitar problemas de serialización en JSON
    private List<OrderDetail> orderDetails = new ArrayList<>();

    @Column(nullable = false)
    private Double total;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    private String paymentMethod;
    private String pickupLocation;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // 🔹 Constructores
    public Order() {}

    public Order(User user, ShoppingCart shoppingCart, Double total, String paymentMethod, String pickupLocation) {
        this.user = user;
        this.shoppingCart = shoppingCart;
        this.total = total;
        this.paymentMethod = paymentMethod;
        this.pickupLocation = pickupLocation;
        this.status = OrderStatus.PENDING;
    }

    // 🔹 Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public ShoppingCart getShoppingCart() { return shoppingCart; }
    public void setShoppingCart(ShoppingCart shoppingCart) { this.shoppingCart = shoppingCart; }

    public List<OrderDetail> getOrderDetails() { return orderDetails; }
    public void setOrderDetails(List<OrderDetail> orderDetails) { this.orderDetails = orderDetails; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
