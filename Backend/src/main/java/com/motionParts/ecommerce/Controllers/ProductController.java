package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.Models.Product;
import com.motionParts.ecommerce.Models.ProductImage;
import com.motionParts.ecommerce.dto.ProductDTO;
import com.motionParts.ecommerce.repositories.ProductImageRepository;
import com.motionParts.ecommerce.repositories.ProductRepository;
import com.motionParts.ecommerce.services.ProductService;
import com.motionParts.ecommerce.services.ImageStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;       

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private ImageStorageService imageStorageService;

    @Autowired
    private ProductRepository productRepository;

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

    @PostMapping("/{id}/upload-images")
    public ResponseEntity<List<String>> uploadImages(
    @PathVariable Long id,
    @RequestParam("images") MultipartFile[] images
    ) {
    try {
        System.out.println("Subiendo imágenes para el producto ID: " + id);
        List<String> urls = imageStorageService.storeImages(id, images);
        System.out.println("Rutas generadas: " + urls);
        
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            List<ProductImage> savedImages = new ArrayList<>();
            for (String url : urls) {
                ProductImage image = new ProductImage();
                image.setImage_url(url);
                image.setProduct(product);
                savedImages.add(productImageRepository.save(image));
            }
        }
        return ResponseEntity.ok(urls);
    } catch (IOException e) {
        System.err.println("Error al subir imágenes: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
    }

    @PostMapping("/{id}/upload-main-image")
    public ResponseEntity<String> uploadMainImage(
        @PathVariable Long id,
        @RequestParam("image") MultipartFile image
    ) {
        try {
            String imageUrl = imageStorageService.storeMainImage(id, image);
            productService.updateProductImage(id, imageUrl); // <-- este método guarda image_url
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
