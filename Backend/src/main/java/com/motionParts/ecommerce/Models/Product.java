package com.motionParts.ecommerce.Models;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private double price;
    private int stock;
    private String reference;

    // Imagen principal (una sola URL)
    @Column(name = "image_url")
    private String image_url;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> imageGallery = new ArrayList<>();

    @Column(updatable = false)
    private LocalDateTime created_at;

    @Column(nullable = false)
    private LocalDateTime updated_at;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductCategory> productCategories = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<OrderDetail> orderDetails = new ArrayList<>();

    // Imágenes adicionales (galería)
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> productImages = new ArrayList<>();

    public Product() {}

    public Product(String name, String description, double price, int stock, String reference, String image_url) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.reference = reference;
        this.image_url = image_url;
        this.created_at = LocalDateTime.now();
        this.updated_at = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getImage_url() { return image_url; }
    public void setImage_url(String image_url) { this.image_url = image_url; }

    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }

    public LocalDateTime getUpdated_at() { return updated_at; }
    public void setUpdated_at(LocalDateTime updated_at) { this.updated_at = updated_at; }

    public List<ProductCategory> getProductCategories() { return productCategories; }
    public void setProductCategories(List<ProductCategory> productCategories) { this.productCategories = productCategories; }

    public List<OrderDetail> getOrderDetails() { return orderDetails; }
    public void setOrderDetails(List<OrderDetail> orderDetails) { this.orderDetails = orderDetails; }

    public List<ProductImage> getImageGallery() { return imageGallery; }
    public void setImageGallery(List<ProductImage> imageGallery) { this.imageGallery = imageGallery; }
}