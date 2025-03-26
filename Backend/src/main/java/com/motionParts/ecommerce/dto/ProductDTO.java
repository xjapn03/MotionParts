package com.motionParts.ecommerce.dto;

import java.util.List;

public class ProductDTO {
    private Long id;
    private String reference;
    private String name;
    private String description;
    private int stock;
    private double price;
    private String image_url; // Nuevo campo para la imagen
    private List<CategoryDTO> categories; 

    public ProductDTO() {}

    public ProductDTO(Long id, String reference, String name, String description, int stock, double price, String image_url, List<CategoryDTO> categories) {
        this.id = id;
        this.reference = reference;
        this.name = name;
        this.description = description;
        this.stock = stock;
        this.price = price;
        this.image_url = image_url; // Asignar imagen
        this.categories = categories;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getImage_url() { return image_url; }
    public void setImage_url(String image_url) { this.image_url = image_url; } // Getter y Setter para imagen

    public List<CategoryDTO> getCategories() { return categories; }
    public void setCategories(List<CategoryDTO> categories) { this.categories = categories; }
}
