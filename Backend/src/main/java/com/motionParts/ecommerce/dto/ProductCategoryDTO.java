package com.motionParts.ecommerce.dto;

public class ProductCategoryDTO {
    private Long productId;
    private Long categoryId;

    public ProductCategoryDTO() {}

    public ProductCategoryDTO(Long productId, Long categoryId) {
        this.productId = productId;
        this.categoryId = categoryId;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
}
