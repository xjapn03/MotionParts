package com.motionParts.ecommerce.Models;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int client_id;
    private LocalDateTime date;
    private String status;
    private double total_amount;

    public Order() {}

    public Order(int client_id, LocalDateTime date, String status, double total_amount) {
        this.client_id = client_id;
        this.date = date;
        this.status = status;
        this.total_amount = total_amount;
    }

    public Long getId() { return id; }
    public int getClient_id() { return client_id; }
    public void setClient_id(int client_id) { this.client_id = client_id; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getTotal_amount() { return total_amount; }
    public void setTotal_amount(double total_amount) { this.total_amount = total_amount; }
}
