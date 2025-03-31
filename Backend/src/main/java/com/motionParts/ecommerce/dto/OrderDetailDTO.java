package com.motionParts.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.motionParts.ecommerce.Models.OrderDetail;

public class OrderDetailDTO {
    private Long id;
    private Long orderId;
    private Long productId;
    private String productName;
    private int quantity;
    private double unitPrice;
    private double subtotal;

    public OrderDetailDTO() {}

    // Constructor con parámetros, usando @JsonCreator y @JsonProperty para deserialización
    @JsonCreator
    public OrderDetailDTO(@JsonProperty("id") Long id,
                          @JsonProperty("orderId") Long orderId,
                          @JsonProperty("productId") Long productId,
                          @JsonProperty("productName") String productName,
                          @JsonProperty("quantity") int quantity,
                          @JsonProperty("unitPrice") double unitPrice,
                          @JsonProperty("subtotal") double subtotal) {
        this.id = id;
        this.orderId = orderId;
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.subtotal = subtotal;
    }

    public OrderDetailDTO(OrderDetail orderDetail) {
    this.id = orderDetail.getId();
    this.orderId = orderDetail.getOrder().getId();  // Corregido: obtener el ID de la orden
    this.productId = orderDetail.getProduct().getId();
    this.productName = orderDetail.getProduct().getName();
    this.quantity = orderDetail.getQuantity();
    this.unitPrice = orderDetail.getUnitPrice();
    this.subtotal = orderDetail.getSubtotal();  // Si se calcula en el backend, se usa directamente
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
}
