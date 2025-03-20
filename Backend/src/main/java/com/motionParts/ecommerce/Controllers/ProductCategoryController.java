package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.dto.ProductCategoryDTO;
import com.motionParts.ecommerce.Models.ProductCategory;
import com.motionParts.ecommerce.services.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-category")
@CrossOrigin(origins = "http://localhost:4200") // Ajusta según sea necesario
public class ProductCategoryController {

    @Autowired
    private ProductCategoryService productCategoryService;

    // 🔹 Obtener todas las relaciones Producto - Categoría
    @GetMapping
    public List<ProductCategory> getAllProductCategories() {
        return productCategoryService.getAllProductCategories();
    }

    // 🔹 Obtener categorías asociadas a un producto específico
    @GetMapping("/categories/{productId}")
    public List<ProductCategoryDTO> getCategoriesByProduct(@PathVariable Long productId) {
        return productCategoryService.getCategoriesByProduct(productId);
    }

    @GetMapping("/products/{categoryId}")
    public List<ProductCategoryDTO> getProductsByCategory(@PathVariable Long categoryId) {
        return productCategoryService.getProductsByCategory(categoryId);
    }

    // 🔹 Asignar una categoría a un producto
    @PostMapping
    public ProductCategory assignCategoryToProduct(@RequestBody ProductCategoryDTO dto) {
        return productCategoryService.assignCategoryToProduct(dto);
    }

    // 🔹 Eliminar una relación Producto - Categoría
    @DeleteMapping("/{id}")
    public void deleteProductCategory(@PathVariable Long id) {
        productCategoryService.removeCategoryFromProduct(id);
    }
}