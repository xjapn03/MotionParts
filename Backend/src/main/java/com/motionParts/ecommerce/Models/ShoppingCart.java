package com.motionParts.ecommerce.Models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "shopping_carts")
public class ShoppingCart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne  // Relación con la tabla users
    @JoinColumn(name = "user_id", nullable = false) // En la BD, el campo será user_id
    private User user;

    @OneToMany(mappedBy = "shoppingCart", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference  // 🔹 Permite la serialización controlada de `cartItems`
    private List<CartItem> cartItems = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShoppingCartStatus status = ShoppingCartStatus.ACTIVE;

    public ShoppingCart() {}

    public ShoppingCart(User user, ShoppingCartStatus status) {
        this.user = user;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<CartItem> getCartItems() { return cartItems; }
    public void setCartItems(List<CartItem> cartItems) { this.cartItems = cartItems; }

    public ShoppingCartStatus getStatus() { return status; }
    public void setStatus(ShoppingCartStatus status) { this.status = status; }

    public double getTotalCartPrice() {
        return cartItems.stream().mapToDouble(CartItem::getTotalPrice).sum();
    }
}
