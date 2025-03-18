package com.motionParts.ecommerce.dto;

import com.motionParts.ecommerce.Models.Product;

public class CartItemDTO {
    private Long id;
    private Long shoppingCartId;
    private Product product; // 🔹 También podrías usar `ProductDTO`
    private int quantity;
    private double unitPrice;
    private double totalPrice;  

    public CartItemDTO(Long id, Long shoppingCartId, Product product, int quantity, double unitPrice, double totalPrice) {
        this.id = id;
        this.shoppingCartId = shoppingCartId;
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
    }

    public Long getId() { return id; }
    public Long getShoppingCartId() { return shoppingCartId; }
    public Product getProduct() { return product; }
    public int getQuantity() { return quantity; }
    public double getUnitPrice() { return unitPrice; }
    public double getTotalPrice() { return totalPrice; }
}
