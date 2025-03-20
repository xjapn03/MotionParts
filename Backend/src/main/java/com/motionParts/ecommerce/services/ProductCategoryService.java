package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.dto.ProductCategoryDTO;
import com.motionParts.ecommerce.Models.Product;
import com.motionParts.ecommerce.Models.Category;
import com.motionParts.ecommerce.Models.ProductCategory;
import com.motionParts.ecommerce.repositories.ProductCategoryRepository;
import com.motionParts.ecommerce.repositories.ProductRepository;
import com.motionParts.ecommerce.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductCategoryService {

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // 🔹 Obtener todas las relaciones Producto - Categoría
    public List<ProductCategory> getAllProductCategories() {
        return productCategoryRepository.findAll();
    }

    // 🔹 Asignar una categoría a un producto con DTO
    public ProductCategory assignCategoryToProduct(ProductCategoryDTO dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + dto.getProductId()));
        
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + dto.getCategoryId()));
    
        ProductCategory productCategory = new ProductCategory(product, category);
        return productCategoryRepository.save(productCategory);
    }

    public List<ProductCategoryDTO> getCategoriesByProduct(Long productId) {
        return productCategoryRepository.findByProductId(productId)
                .stream()
                .map(pc -> new ProductCategoryDTO(pc.getProduct().getId(), pc.getCategory().getId()))
                .collect(Collectors.toList());
    }
    
    public List<ProductCategoryDTO> getProductsByCategory(Long categoryId) {
        return productCategoryRepository.findByCategoryId(categoryId)
                .stream()
                .map(pc -> new ProductCategoryDTO(pc.getProduct().getId(), pc.getCategory().getId()))
                .collect(Collectors.toList());
    }

    // 🔹 Eliminar una relación Producto - Categoría
    public void removeCategoryFromProduct(Long productCategoryId) {
        productCategoryRepository.deleteById(productCategoryId);
    }
}
