package com.motionParts.ecommerce.dto;

import com.motionParts.ecommerce.Models.Order;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OrderDTO {
    private Long id;
    private Long userId;
    private List<OrderDetailDTO> orderDetails;
    private String status;
    private Double total;
    private String paymentMethod;
    private String pickupLocation;
    private LocalDateTime createdAt;
    private BillingDataDTO billingData;
    private ShippingDataDTO shippingData;
    private String couponCode;
    private String shippingMethod;
    private Boolean acceptedTerms;

    // ✅ Constructor vacío (necesario para frameworks como Spring)
    public OrderDTO() {}

    public OrderDTO(Order order) {
        this.id = order.getId();
        this.userId = order.getUser().getId();
        this.total = order.getTotal();
        this.paymentMethod = order.getPaymentMethod();
        this.pickupLocation = order.getPickupLocation();
        this.createdAt = order.getCreatedAt();
        this.billingData = (order.getBillingData() != null) ? new BillingDataDTO(order.getBillingData()) : null;
        this.shippingData = (order.getShippingData() != null) ? new ShippingDataDTO(order.getShippingData()) : null;
        this.couponCode = order.getCouponCode();
        this.shippingMethod = order.getShippingMethod();
        this.acceptedTerms = (order.getAcceptedTerms() != null) ? order.getAcceptedTerms() : false;
        this.status = order.getStatus().toString(); // Convertimos el ENUM a String

        // Convertir detalles de la orden a DTOs (evitamos posibles NPE)
        this.orderDetails = (order.getOrderDetails() != null) ? 
            order.getOrderDetails().stream()
                .map(OrderDetailDTO::new)
                .collect(Collectors.toList()) 
            : null;
    }

    // ✅ Constructor con todos los atributos
    public OrderDTO(Long id, Long userId, List<OrderDetailDTO> orderDetails, String status, 
                    Double total, String paymentMethod, String pickupLocation, LocalDateTime createdAt, 
                    BillingDataDTO billingData, ShippingDataDTO shippingData, 
                    String couponCode, String shippingMethod, Boolean acceptedTerms) {
        this.id = id;
        this.userId = userId;
        this.orderDetails = orderDetails;
        this.status = status;
        this.total = total;
        this.paymentMethod = paymentMethod;
        this.pickupLocation = pickupLocation;
        this.createdAt = createdAt;
        this.billingData = billingData;
        this.shippingData = shippingData;
        this.couponCode = couponCode;
        this.shippingMethod = shippingMethod;
        this.acceptedTerms = acceptedTerms;
    }

    // ✅ Getters y Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<OrderDetailDTO> getOrderDetails() { return orderDetails; }
    public void setOrderDetails(List<OrderDetailDTO> orderDetails) { this.orderDetails = orderDetails; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getTotal() { return total; }  
    public void setTotal(Double total) { this.total = total; }  

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public BillingDataDTO getBillingData() { return billingData; }
    public void setBillingData(BillingDataDTO billingData) { this.billingData = billingData; }

    public ShippingDataDTO getShippingData() { return shippingData; }
    public void setShippingData(ShippingDataDTO shippingData) { this.shippingData = shippingData; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public String getShippingMethod() { return shippingMethod; }
    public void setShippingMethod(String shippingMethod) { this.shippingMethod = shippingMethod; }

    public Boolean getAcceptedTerms() { return acceptedTerms; }
    public void setAcceptedTerms(Boolean acceptedTerms) { this.acceptedTerms = acceptedTerms; }
}
