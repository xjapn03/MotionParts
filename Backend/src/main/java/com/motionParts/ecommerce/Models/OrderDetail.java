package com.motionParts.ecommerce.Models;

import jakarta.persistence.*;

@Entity
@Table(name = "order_details")
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne // 🔹 Se establece la relación con `Product`
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double unitPrice;

    @Column(nullable = false)
    private Double subtotal; // 🔹 Se almacena en la BD para evitar cálculos innecesarios

    // 🔹 Constructor vacío
    public OrderDetail() {}

    // 🔹 Constructor con parámetros
    public OrderDetail(Order order, Product product, Integer quantity, Double unitPrice) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.subtotal = quantity * unitPrice; // 🔹 Calcular subtotal al crear la orden
    }

    // 🔹 Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Product getProduct() { return product; } // 🔹 Nuevo método para obtener el producto
    public void setProduct(Product product) { this.product = product; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { 
        this.quantity = quantity; 
        this.subtotal = this.quantity * this.unitPrice; // 🔹 Recalcular subtotal
    }

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { 
        this.unitPrice = unitPrice; 
        this.subtotal = this.quantity * this.unitPrice; // 🔹 Recalcular subtotal
    }

    public Double getSubtotal() { return subtotal; }
}
