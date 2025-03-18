package com.motionParts.ecommerce.Models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonBackReference  
    private ShoppingCart shoppingCart;

    @ManyToOne  
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;  

    private int quantity;
    private double unitPrice;
    private double totalPrice;  

    public CartItem() {}

    public CartItem(ShoppingCart shoppingCart, Product product, int quantity, double unitPrice) {
        this.shoppingCart = shoppingCart;
        this.product = product;
        this.quantity = Math.max(quantity, 0); // Evita valores negativos
        this.unitPrice = Math.max(unitPrice, 0); // Evita valores negativos
        this.calculateTotalPrice();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ShoppingCart getShoppingCart() { return shoppingCart; }
    public void setShoppingCart(ShoppingCart shoppingCart) { this.shoppingCart = shoppingCart; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { 
        this.quantity = Math.max(quantity, 0); 
        this.calculateTotalPrice();
    }

    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { 
        this.unitPrice = Math.max(unitPrice, 0); 
        this.calculateTotalPrice();
    }

    public double getTotalPrice() { return totalPrice; }

    @PrePersist
    @PreUpdate
    private void calculateTotalPrice() {
        this.totalPrice = this.unitPrice * this.quantity;
    }
}
