package com.motionParts.ecommerce.repositories;

import com.motionParts.ecommerce.Models.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    
    // Buscar imágenes por producto
    List<ProductImage> findByProductId(Long productId);
    
    // Eliminar todas las imágenes asociadas a un producto
    void deleteByProductId(Long productId);

    boolean existsByImageUrl(String imageUrl); // ← ahora sí funcionará
}