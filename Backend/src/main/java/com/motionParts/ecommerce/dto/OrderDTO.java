package com.motionParts.ecommerce.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {
    private Long id;
    private Long userId;
    private List<OrderDetailDTO> orderDetails;
    private String status;
    private double totalPrice;
    private String paymentMethod;
    private String pickupLocation;
    private LocalDateTime createdAt;

    public OrderDTO(Long id, Long userId, List<OrderDetailDTO> orderDetails, String status, 
                    double totalPrice, String paymentMethod, String pickupLocation, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.orderDetails = orderDetails;
        this.status = status;
        this.totalPrice = totalPrice;
        this.paymentMethod = paymentMethod;
        this.pickupLocation = pickupLocation;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<OrderDetailDTO> getOrderDetails() { return orderDetails; }
    public void setOrderDetails(List<OrderDetailDTO> orderDetails) { this.orderDetails = orderDetails; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
