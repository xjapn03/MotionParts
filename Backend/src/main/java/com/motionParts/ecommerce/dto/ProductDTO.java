package com.motionParts.ecommerce.dto;

import com.motionParts.ecommerce.Models.Product;
import java.util.List;
import java.util.stream.Collectors;

public class ProductDTO {
    private Long id;
    private String reference;
    private String name;
    private String description;
    private int stock;
    private double price;
    private List<CategoryDTO> categories;

    public ProductDTO() {}

    // Constructor estándar
    public ProductDTO(Long id, String reference, String name, String description, int stock, double price, List<CategoryDTO> categories) {
        this.id = id;
        this.reference = reference;
        this.name = name;
        this.description = description;
        this.stock = stock;
        this.price = price;
        this.categories = categories;
    }

    // Constructor para convertir `Product` a `ProductDTO`
    public ProductDTO(Product product) {
        this.id = product.getId();
        this.reference = product.getReference();
        this.name = product.getName();
        this.description = product.getDescription();
        this.stock = product.getStock();
        this.price = product.getPrice();
        
        // ✅ Corregido: Obtener el nombre desde `productCategory.getCategory().getName()`
        this.categories = product.getProductCategories().stream()
        .map(productCategory -> new CategoryDTO(
            productCategory.getCategory().getId(), 
            productCategory.getCategory().getName(),
            productCategory.getCategory().getDescription() // ✅ Asegura que esta propiedad existe en `Category`
        ))
        .collect(Collectors.toList());
    }
    

    // Getters y setters
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

    public List<CategoryDTO> getCategories() { return categories; }
    public void setCategories(List<CategoryDTO> categories) { this.categories = categories; }
}
