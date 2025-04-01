package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.Models.Product;
import com.motionParts.ecommerce.Models.Category;
import com.motionParts.ecommerce.Models.ProductCategory;
import com.motionParts.ecommerce.dto.ProductDTO;
import com.motionParts.ecommerce.dto.CategoryDTO;
import com.motionParts.ecommerce.repositories.ProductRepository;
import com.motionParts.ecommerce.repositories.CategoryRepository;
import org.springframework.transaction.annotation.Transactional;
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
    private CategoryRepository categoryRepository; // ✅ Agregado para buscar categorías en BD

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
                .map(pc -> new CategoryDTO(
                        pc.getCategory().getId(),
                        pc.getCategory().getName(),
                        pc.getCategory().getDescription()
                ))
                .collect(Collectors.toList());
    }

    // Actualizar un producto
    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        System.out.println("Actualizando producto con ID: " + id);
        System.out.println("Producto DTO recibido: " + productDTO);
    Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
    
    // Actualizar los datos del producto
    product.setName(productDTO.getName());
    product.setDescription(productDTO.getDescription());
    product.setPrice(productDTO.getPrice());
    product.setStock(productDTO.getStock());
    product.setReference(productDTO.getReference());
    product.setImage_url(productDTO.getImage_url());
    product.setUpdated_at(LocalDateTime.now());
    // Guardar el producto actualizado
    product = productRepository.save(product);
    // Eliminar categorías existentes y asociar nuevas categorías
    productCategoryRepository.deleteByProductId(id); // Elimina las relaciones previas
    if (productDTO.getCategories() != null && !productDTO.getCategories().isEmpty()) {
        for (CategoryDTO categoryDTO : productDTO.getCategories()) {
            Category category = categoryRepository.findById(categoryDTO.getId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + categoryDTO.getId()));
            // Crear la relación ProductCategory
            ProductCategory productCategory = new ProductCategory(product, category);
            productCategoryRepository.save(productCategory);
        }
    }
    return convertToDTO(product);
    }

    // Crear un nuevo producto
    public ProductDTO createProduct(ProductDTO productDTO) {
        try {
            // Validaciones básicas
            if (productDTO.getName() == null || productDTO.getName().trim().isEmpty()) {
                throw new IllegalArgumentException("El nombre del producto no puede estar vacío.");
            }
            if (productDTO.getPrice() <= 0) {
                throw new IllegalArgumentException("El precio del producto debe ser mayor a cero.");
            }
            // Imprime el contenido de productDTO para asegurarte de que el frontend está enviando correctamente las categorías
            System.out.println("ProductDTO recibido: " + productDTO);
            System.out.println("Categorías recibidas: " + productDTO.getCategories());
            System.out.println("JSON recibido: " + productDTO);
            System.out.println("Categorías recibidas en JSON: " + productDTO.getCategories());

            // Crear el producto
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
            System.out.println("Producto guardado con ID: " + product.getId());
    
            // Asociar las categorías al producto
            if (productDTO.getCategories() != null && !productDTO.getCategories().isEmpty()) {
                for (CategoryDTO categoryDTO : productDTO.getCategories()) {
                    System.out.println("Procesando categoría ID: " + categoryDTO.getId());
                    // Buscar la categoría en la base de datos
                    Category category = categoryRepository.findById(categoryDTO.getId())
                            .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + categoryDTO.getId()));

                    // Crear la relación ProductCategory
                    ProductCategory productCategory = new ProductCategory(product, category);
                    productCategoryRepository.save(productCategory); // ✅ Guardamos la relación en la BD

                    System.out.println("Categoría asignada: Producto " + product.getId() + " -> Categoría " + category.getId());
                }
            } else {
                System.out.println("No se proporcionaron categorías para este producto.");
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
