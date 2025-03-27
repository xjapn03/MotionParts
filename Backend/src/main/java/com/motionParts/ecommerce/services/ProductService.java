package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.Models.Product;
import com.motionParts.ecommerce.dto.ProductDTO;
import com.motionParts.ecommerce.dto.CategoryDTO;
import com.motionParts.ecommerce.repositories.ProductRepository;
import com.motionParts.ecommerce.repositories.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
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

    // Actualizar la imagen de un producto y actualizar `updated_at`
    public ProductDTO updateProductImage(Long productId, String image_url) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + productId));
        product.setImage_url(image_url);
        product.setUpdated_at(LocalDateTime.now()); // Se actualiza la fecha de modificación
        productRepository.save(product);
        return convertToDTO(product);
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

    // Actualizar un producto completo
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setStock(productDTO.getStock());
        product.setReference(productDTO.getReference());
        product.setImage_url(productDTO.getImage_url());

        product.setUpdated_at(LocalDateTime.now()); // Se actualiza la fecha de modificación

        productRepository.save(product);
        return convertToDTO(product);
    }

    // Crear un nuevo producto
    public ProductDTO createProduct(ProductDTO productDTO) {
        try {
            if (productDTO.getName() == null || productDTO.getName().trim().isEmpty()) {
                throw new IllegalArgumentException("El nombre del producto no puede estar vacío.");
            }
            if (productDTO.getPrice() <= 0) {
                throw new IllegalArgumentException("El precio del producto debe ser mayor a cero.");
            }

            Product product = new Product();
            product.setName(productDTO.getName());
            product.setDescription(productDTO.getDescription());
            product.setPrice(productDTO.getPrice());
            product.setStock(productDTO.getStock());
            product.setReference(productDTO.getReference());
            product.setImage_url(productDTO.getImage_url());

            product.setUpdated_at(LocalDateTime.now()); // 🔥 Se inicializa `updated_at`

            productRepository.save(product);
            return convertToDTO(product);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al crear el producto: " + e.getMessage());
        }
    }

    // Eliminar un producto
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado con ID: " + id);
        }
        try {
            productRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error al eliminar el producto con ID: " + id);
        }
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
                product.getImage_url(),
                categories
        );
    }
}
