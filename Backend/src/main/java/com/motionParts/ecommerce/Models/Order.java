package com.motionParts.ecommerce.Models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true) // 🔹 Puede ser null si el usuario es invitado
    private User user;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cart_id", nullable = false)
    private ShoppingCart shoppingCart;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<OrderDetail> orderDetails = new ArrayList<>();

    @Column(nullable = false)
    private Double total;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    private String paymentMethod;
    private String pickupLocation;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 🏦 Datos de facturación (billing)
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "firstName", column = @Column(name = "billing_first_name")), // ✅ Antes "nombre"
        @AttributeOverride(name = "lastName", column = @Column(name = "billing_last_name")), // ✅ Antes "apellidos"
        @AttributeOverride(name = "idType", column = @Column(name = "billing_id_type")), // ✅ Antes "tipoIdentificacion"
        @AttributeOverride(name = "idNumber", column = @Column(name = "billing_id_number")), // ✅ Antes "numeroIdentificacion"
        @AttributeOverride(name = "address", column = @Column(name = "billing_address")), // ✅ Antes "direccion"
        @AttributeOverride(name = "addressDetail", column = @Column(name = "billing_address_detail")), // ✅ Antes "direccionDetalle"
        @AttributeOverride(name = "country", column = @Column(name = "billing_country")), // ✅ Antes "pais"
        @AttributeOverride(name = "region", column = @Column(name = "billing_region")), // ✅ Antes "departamento"
        @AttributeOverride(name = "city", column = @Column(name = "billing_city")), // ✅ Antes "ciudad"
        @AttributeOverride(name = "postalCode", column = @Column(name = "billing_postal_code")), // ✅ Antes "codigoPostal"
        @AttributeOverride(name = "phone", column = @Column(name = "billing_phone")), // ✅ Antes "telefono"
        @AttributeOverride(name = "email", column = @Column(name = "billing_email")) // ✅ Sin cambios
    })
    private BillingData billingData;

    // 📦 Datos de envío (shipping) - **Coincide con las columnas de la BD**
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "firstName", column = @Column(name = "shipping_first_name")), // ✅ Antes "nombre"
        @AttributeOverride(name = "lastName", column = @Column(name = "shipping_last_name")), // ✅ Antes "apellidos"
        @AttributeOverride(name = "address", column = @Column(name = "shipping_address")), // ✅ Antes "direccion"
        @AttributeOverride(name = "addressDetail", column = @Column(name = "shipping_address_detail")), // ✅ Antes "direccionDetalle"
        @AttributeOverride(name = "country", column = @Column(name = "shipping_country")), // ✅ Antes "pais"
        @AttributeOverride(name = "region", column = @Column(name = "shipping_region")), // ✅ Antes "departamento"
        @AttributeOverride(name = "city", column = @Column(name = "shipping_city")), // ✅ Antes "ciudad"
        @AttributeOverride(name = "postalCode", column = @Column(name = "shipping_postal_code")), // ✅ Antes "codigoPostal"
        @AttributeOverride(name = "notes", column = @Column(name = "shipping_notes")) // ✅ Antes "notas"
    })
    private ShippingData shippingData;

    private String couponCode;
    private String shippingMethod;

    @Column(nullable = false)
    private Boolean acceptedTerms = true;

    // ✅ Método para establecer la fecha antes de persistir en la BD
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // ✅ Constructor vacío
    public Order() {}

    // ✅ Constructor completo
    public Order(User user, ShoppingCart shoppingCart, Double total, String paymentMethod, 
                 String pickupLocation, BillingData billingData, ShippingData shippingData,
                 String couponCode, String shippingMethod, Boolean acceptedTerms) {
        this.user = user;
        this.shoppingCart = shoppingCart;
        this.total = total;
        this.paymentMethod = paymentMethod;
        this.pickupLocation = pickupLocation;
        this.status = OrderStatus.PENDING;
        this.billingData = billingData;
        this.shippingData = shippingData;
        this.couponCode = couponCode;
        this.shippingMethod = shippingMethod;
        this.acceptedTerms = acceptedTerms;
    }

    // ✅ Constructor sin `couponCode`, `shippingMethod`, `acceptedTerms`
    public Order(User user, ShoppingCart shoppingCart, Double total, String paymentMethod, 
                 String pickupLocation, BillingData billingData, ShippingData shippingData) {
        this(user, shoppingCart, total, paymentMethod, pickupLocation, billingData, shippingData, null, null, true);
    }

    // 🔹 Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public ShoppingCart getShoppingCart() { return shoppingCart; }
    public void setShoppingCart(ShoppingCart shoppingCart) { this.shoppingCart = shoppingCart; }

    public List<OrderDetail> getOrderDetails() { return orderDetails; }
    public void setOrderDetails(List<OrderDetail> orderDetails) { this.orderDetails = orderDetails; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public BillingData getBillingData() { return billingData; }
    public void setBillingData(BillingData billingData) { this.billingData = billingData; }

    public ShippingData getShippingData() { return shippingData; }
    public void setShippingData(ShippingData shippingData) { this.shippingData = shippingData; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public String getShippingMethod() { return shippingMethod; }
    public void setShippingMethod(String shippingMethod) { this.shippingMethod = shippingMethod; }

    public Boolean getAcceptedTerms() { return acceptedTerms; }
    public void setAcceptedTerms(Boolean acceptedTerms) { this.acceptedTerms = acceptedTerms; }

    
}
