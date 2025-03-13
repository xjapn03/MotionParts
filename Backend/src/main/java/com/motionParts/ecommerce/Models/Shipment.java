package com.motionParts.ecommerce.Models;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "shipments") 
public class Shipment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_shipment;
    
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    private String shipping_company;
    private String shipping_status;
    private String tracking_number;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;

    public Shipment() {}

    public Shipment(Order order, String shipping_company, String shipping_status, String tracking_number) {
        this.order = order;
        this.shipping_company = shipping_company;
        this.shipping_status = shipping_status;
        this.tracking_number = tracking_number;
        this.created_at = LocalDateTime.now();
    }

    public Long getId_shipment() { return id_shipment; }
    public void setId_shipment(Long id_shipment) { this.id_shipment = id_shipment; }
    
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    
    public String getShipping_company() { return shipping_company; }
    public void setShipping_company(String shipping_company) { this.shipping_company = shipping_company; }
    
    public String getShipping_status() { return shipping_status; }
    public void setShipping_status(String shipping_status) { this.shipping_status = shipping_status; }
    
    public String getTracking_number() { return tracking_number; }
    public void setTracking_number(String tracking_number) { this.tracking_number = tracking_number; }
    
    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }
    
    public LocalDateTime getUpdated_at() { return updated_at; }
    public void setUpdated_at(LocalDateTime updated_at) { this.updated_at = updated_at; }
}
