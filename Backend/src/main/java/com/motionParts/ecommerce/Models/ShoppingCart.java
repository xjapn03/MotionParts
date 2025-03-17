package com.motionParts.ecommerce.Models;

import jakarta.persistence.*;

@Entity
@Table(name = "shopping_carts")
public class ShoppingCart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Cambio de id_cart -> id

    @Column(name = "client_id", nullable = false)
    private Long clientId;  // Cambio de client_id -> clientId (camelCase)

    public ShoppingCart() {}

    public ShoppingCart(Long clientId) {
        this.clientId = clientId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
}
