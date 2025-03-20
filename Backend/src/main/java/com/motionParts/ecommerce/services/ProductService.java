package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.Models.Product;
import com.motionParts.ecommerce.dto.ProductDTO;
import com.motionParts.ecommerce.dto.CategoryDTO;
import com.motionParts.ecommerce.repositories.ProductRepository;
import com.motionParts.ecommerce.repositories.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    // Obtener todos los productos y convertirlos a DTO
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Obtener un producto por ID y convertirlo a DTO
    public ProductDTO getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
    }

    // Obtener las categorías asociadas a un producto
    public List<CategoryDTO> getCategoriesByProductId(Long productId) {
        return productCategoryRepository.findByProductId(productId)
                .stream()
                .map(pc -> new CategoryDTO(
                        pc.getCategory().getId(),
                        pc.getCategory().getName(),
                        pc.getCategory().getDescription()
                ))
                .collect(Collectors.toList());
    }

    // Convertir Product a ProductDTO
    private ProductDTO convertToDTO(Product product) {
        List<CategoryDTO> categories = getCategoriesByProductId(product.getId());

        return new ProductDTO(
                product.getId(),
                product.getReference(),
                product.getName(),
                product.getDescription(),
                product.getStock(),
                product.getPrice(),
                categories
        );
    }
}
