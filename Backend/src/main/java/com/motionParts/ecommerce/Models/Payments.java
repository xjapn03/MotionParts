package com.motionParts.ecommerce.Models;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int order_id;
    private double amount;
    private LocalDateTime date;
    private String payment_method;

    public Payment() {}

    public Payment(int order_id, double amount, LocalDateTime date, String payment_method) {
        this.order_id = order_id;
        this.amount = amount;
        this.date = date;
        this.payment_method = payment_method;
    }

    public Long getId() { return id; }
    public int getOrder_id() { return order_id; }
    public void setOrder_id(int order_id) { this.order_id = order_id; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public String getPayment_method() { return payment_method; }
    public void setPayment_method(String payment_method) { this.payment_method = payment_method; }
}

