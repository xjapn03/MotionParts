package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.dto.ProductDTO;
import com.motionParts.ecommerce.services.ProductService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Obtener todos los productos en formato DTO
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // Obtener un producto por ID en formato DTO
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    // Nuevo endpoint para actualizar la imagen de un producto
    @PutMapping("/{id}/image")
    public ResponseEntity<ProductDTO> updateProductImage(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String imageUrl = request.get("imageUrl"); // Obtener la URL desde el JSON enviado
        if (imageUrl == null || imageUrl.isEmpty()) {
            return ResponseEntity.badRequest().build(); // Validar que la URL no sea nula
        }

        ProductDTO updatedProduct = productService.updateProductImage(id, imageUrl);
        return ResponseEntity.ok(updatedProduct);
    }
}
