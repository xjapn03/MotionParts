package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.dto.ProductDTO;
import com.motionParts.ecommerce.services.ProductService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

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

        String image_url = request.get("image_url"); // Obtener la URL desde el JSON enviado
        if (image_url == null || image_url.isEmpty()) {
            return ResponseEntity.badRequest().build(); // Validar que la URL no sea nula
        }

        ProductDTO updatedProduct = productService.updateProductImage(id, image_url);
        return ResponseEntity.ok(updatedProduct);
    }

    // Actualizar un producto completo
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductDTO productDTO) {

        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
        if (updatedProduct == null) {
            return ResponseEntity.notFound().build();  // Si el producto no existe, devolver 404
        }

        return ResponseEntity.ok(updatedProduct);  // Devolver el producto actualizado
    }

    // Crear un producto
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        ProductDTO createdProduct = productService.createProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();  // Devuelve 204 sin contenido
    }


}
