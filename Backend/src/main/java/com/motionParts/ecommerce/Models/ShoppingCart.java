package com.motionParts.ecommerce.Models;

import jakarta.persistence.*;

@Entity
@Table(name = "shopping_carts")
public class ShoppingCart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_cart;
    private Long client_id;
    
    public ShoppingCart() {}
    
    public ShoppingCart(Long client_id) {
        this.client_id = client_id;
    }
    
    public Long getId_cart() { return id_cart; }
    public void setId_cart(Long id_cart) { this.id_cart = id_cart; }
    public Long getClient_id() { return client_id; }
    public void setClient_id(Long client_id) { this.client_id = client_id; }
}