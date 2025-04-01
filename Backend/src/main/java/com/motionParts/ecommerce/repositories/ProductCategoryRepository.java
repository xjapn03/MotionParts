package com.motionParts.ecommerce.repositories;

import com.motionParts.ecommerce.Models.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
    List<ProductCategory> findByProductId(Long productId);
    List<ProductCategory> findByCategoryId(Long categoryId);
    // Método para eliminar relaciones por ID de producto
    void deleteByProductId(Long productId);  // Elimina todas las relaciones para el producto dado
}