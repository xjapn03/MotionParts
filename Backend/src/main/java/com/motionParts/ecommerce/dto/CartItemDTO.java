package com.motionParts.ecommerce.dto;

public class CartItemDTO {
    private Long id;
    private Long shoppingCartId;
    private ProductDTO product; // ✅ Ahora usa `ProductDTO`
    private int quantity;
    private double unitPrice;
    private double totalPrice;  

    public CartItemDTO() {} // Constructor vacío requerido por Jackson y JPA

    public CartItemDTO(Long id, Long shoppingCartId, ProductDTO product, int quantity, double unitPrice, double totalPrice) {
        this.id = id;
        this.shoppingCartId = shoppingCartId;
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getShoppingCartId() { return shoppingCartId; }
    public void setShoppingCartId(Long shoppingCartId) { this.shoppingCartId = shoppingCartId; }

    public ProductDTO getProduct() { return product; }
    public void setProduct(ProductDTO product) { this.product = product; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
}
