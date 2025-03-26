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

    // Actualizar la imagen de un producto
    public ProductDTO updateProductImage(Long productId, String image_url) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + productId));

        product.setImage_url(image_url);
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
    // Buscar el producto por su ID
    Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

    // Actualizar los campos del producto con los valores del DTO
    product.setName(productDTO.getName());
    product.setDescription(productDTO.getDescription());
    product.setPrice(productDTO.getPrice());
    product.setStock(productDTO.getStock());
    product.setReference(productDTO.getReference());
    product.setImage_url(productDTO.getImage_url());
    // Aquí podrías añadir otros campos que necesites actualizar

    // Guardar el producto actualizado
    productRepository.save(product);

    // Convertir el producto actualizado a DTO
    return convertToDTO(product);
    }


    // Crear un nuevo producto
    public ProductDTO createProduct(ProductDTO productDTO) {
        try {
            // Validar los datos
            if (productDTO.getName() == null || productDTO.getName().trim().isEmpty()) {
                throw new IllegalArgumentException("El nombre del producto no puede estar vacío.");
            }
            if (productDTO.getPrice() <= 0) {
                throw new IllegalArgumentException("El precio del producto debe ser mayor a cero.");
            }

            // Crear un nuevo producto con los datos del DTO
            Product product = new Product();
            product.setName(productDTO.getName());
            product.setDescription(productDTO.getDescription());
            product.setPrice(productDTO.getPrice());
            product.setStock(productDTO.getStock());
            product.setReference(productDTO.getReference());
            product.setImage_url(productDTO.getImage_url());

            // Guardar el nuevo producto en la base de datos
            productRepository.save(product);

            // Convertir el producto recién creado a DTO
            return convertToDTO(product);
        } catch (Exception e) {
            // Loguear el error para diagnóstico
            e.printStackTrace();
            throw new RuntimeException("Error al crear el producto: " + e.getMessage());
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
                product.getImage_url(),  // Añadir la imagen en el DTO
                categories
        );
    }
}
