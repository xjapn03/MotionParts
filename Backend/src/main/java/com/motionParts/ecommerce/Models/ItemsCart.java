package com.motionParts.ecommerce.Models;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int cart_id;
    private int product_id;
    private int quantity;
    private double unit_price;

    public CartItem() {}

    public CartItem(int cart_id, int product_id, int quantity, double unit_price) {
        this.cart_id = cart_id;
        this.product_id = product_id;
        this.quantity = quantity;
        this.unit_price = unit_price;
    }

    public Long getId() { return id; }
    public int getCart_id() { return cart_id; }
    public void setCart_id(int cart_id) { this.cart_id = cart_id; }

    public int getProduct_id() { return product_id; }
    public void setProduct_id(int product_id) { this.product_id = product_id; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getUnit_price() { return unit_price; }
    public void setUnit_price(double unit_price) { this.unit_price = unit_price; }
}