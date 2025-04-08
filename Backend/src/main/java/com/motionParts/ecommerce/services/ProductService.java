package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.Models.Product;
import com.motionParts.ecommerce.Models.Category;
import com.motionParts.ecommerce.Models.ProductCategory;
import com.motionParts.ecommerce.Models.ProductImage;
import com.motionParts.ecommerce.dto.ProductDTO;
import com.motionParts.ecommerce.dto.CategoryDTO;
import com.motionParts.ecommerce.repositories.ProductRepository;
import com.motionParts.ecommerce.repositories.CategoryRepository;
import org.springframework.transaction.annotation.Transactional;
import com.motionParts.ecommerce.repositories.ProductCategoryRepository;
import com.motionParts.ecommerce.repositories.ProductImageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import java.io.IOException;
import java.nio.file.Path;
import java.io.File;



@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository; // ✅ Agregado para buscar categorías en BD

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Autowired
    private ProductImageRepository productImageRepository;


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

    // Actualizar la imagen de un producto
    public ProductDTO updateProductImage(Long productId, String image_url) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + productId));
        product.setImage_url(image_url);
        product.setUpdated_at(LocalDateTime.now());
        productRepository.save(product);
        return convertToDTO(product);
    }

    // Obtener categorías de un producto
    public List<CategoryDTO> getCategoriesByProductId(Long productId) {
        return productCategoryRepository.findByProductId(productId)
                .stream()
                .map(pc -> {
                    Category cat = pc.getCategory();
                    return new CategoryDTO(
                        cat.getId(),
                        cat.getName(),
                        cat.getDescription(),
                        cat.getParent() != null ? cat.getParent().getId() : null
                    );
                })                
                .collect(Collectors.toList());
    }

    // Actualizar un producto
    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        System.out.println("Actualizando producto con ID: " + id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setStock(productDTO.getStock());
        product.setReference(productDTO.getReference());
        product.setImage_url(productDTO.getImage_url());
        product.setUpdated_at(LocalDateTime.now());

        // Guardar el producto actualizado
        product = productRepository.save(product);

        // Actualizar categorías
        productCategoryRepository.deleteByProductId(id);
        if (productDTO.getCategories() != null && !productDTO.getCategories().isEmpty()) {
            for (CategoryDTO categoryDTO : productDTO.getCategories()) {
                Category category = categoryRepository.findById(categoryDTO.getId())
                        .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + categoryDTO.getId()));
                ProductCategory productCategory = new ProductCategory(product, category);
                productCategoryRepository.save(productCategory);
            }
        }

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
        product.setUpdated_at(LocalDateTime.now());

        // Guardamos el producto primero
        product = productRepository.save(product);

        // Asociar categorías
        if (productDTO.getCategories() != null && !productDTO.getCategories().isEmpty()) {
            for (CategoryDTO categoryDTO : productDTO.getCategories()) {
                Category category = categoryRepository.findById(categoryDTO.getId())
                        .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + categoryDTO.getId()));
                ProductCategory productCategory = new ProductCategory(product, category);
                productCategoryRepository.save(productCategory);
            }
        }

        // Asociar galería de imágenes
        if (productDTO.getGallery() != null && !productDTO.getGallery().isEmpty()) {
            for (String url : productDTO.getGallery()) {
                ProductImage image = new ProductImage(url, product);
                productImageRepository.save(image);
            }
        }

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
            // Primero eliminar carpeta de imágenes del producto
            Path productDir = Paths.get("src/main/assets/products", String.valueOf(id));
            File directory = productDir.toFile();

            if (directory.exists()) {
                deleteDirectoryRecursively(directory);
            }

            // Luego eliminar el producto de la base de datos (esto también elimina imágenes si tienes cascade o lo manejas manualmente)
            productRepository.deleteById(id);

        } catch (Exception e) {
            throw new RuntimeException("Error al eliminar el producto con ID: " + id + ". " + e.getMessage());
        }
    }

    private void deleteDirectoryRecursively(File directory) throws IOException {
        if (directory.isDirectory()) {
            File[] entries = directory.listFiles();
            if (entries != null) {
                for (File entry : entries) {
                    deleteDirectoryRecursively(entry);
                }
            }
        }
        if (!directory.delete()) {
            throw new IOException("No se pudo eliminar: " + directory.getAbsolutePath());
        }
    }
    


    // Convertir Product a ProductDTO
    private ProductDTO convertToDTO(Product product) {
        List<CategoryDTO> categories = getCategoriesByProductId(product.getId());
    
        List<String> gallery = product.getImageGallery().stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());
    
        return new ProductDTO(
                product.getId(),
                product.getReference(),
                product.getName(),
                product.getDescription(),
                product.getStock(),
                product.getPrice(),
                product.getImage_url(),
                gallery,         // ✅ se añade la galería
                categories       // ✅ también categorías
        );
    }        
}
