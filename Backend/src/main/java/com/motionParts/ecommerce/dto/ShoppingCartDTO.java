package com.motionParts.ecommerce.dto;

import java.util.List;

public class ShoppingCartDTO {
    private Long id;
    private String username; // 🔹 Evita exponer el objeto User completo
    private List<CartItemDTO> cartItems;
    private String status;
    private double totalCartPrice; // 🔹 Suma de todos los productos en el carrito

    public ShoppingCartDTO(Long id, String username, List<CartItemDTO> cartItems, String status, double totalCartPrice) {
        this.id = id;
        this.username = username;
        this.cartItems = cartItems;
        this.status = status;
        this.totalCartPrice = totalCartPrice;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public List<CartItemDTO> getCartItems() { return cartItems; }
    public String getStatus() { return status; }
    public double getTotalCartPrice() { return totalCartPrice; }
}
