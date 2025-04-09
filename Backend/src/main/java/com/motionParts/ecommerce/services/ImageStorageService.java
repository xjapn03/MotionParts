package com.motionParts.ecommerce.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.motionParts.ecommerce.Models.Product;
import com.motionParts.ecommerce.Models.ProductImage;
import com.motionParts.ecommerce.repositories.ProductRepository;
import com.motionParts.ecommerce.repositories.ProductImageRepository;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.commons.io.FilenameUtils;

@Service
public class ImageStorageService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Value("${file.upload-dir}")
    private String uploadDir; // Ej: src/main/resources/static/assets/products

    public List<String> storeImages(Long productId, MultipartFile[] files) throws IOException {
        Path productDir = Paths.get(uploadDir, productId.toString());
        Files.createDirectories(productDir);

        List<String> imagePaths = new ArrayList<>();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + productId));

        for (MultipartFile file : files) {
            String originalFilename = FilenameUtils.getName(file.getOriginalFilename());

            boolean existsInDb = productImageRepository.existsByProductIdAndOriginalFilename(productId, originalFilename);
            if (existsInDb) {
                System.out.println("⚠️ Imagen ya registrada con ese nombre: " + originalFilename);
                continue;
            }

            String uniqueFilename = UUID.randomUUID() + "-" + originalFilename;
            Path targetPath = productDir.resolve(uniqueFilename);

            if (Files.exists(targetPath)) {
                System.out.println("⚠️ Imagen ya existe físicamente: " + uniqueFilename);
                continue;
            }

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String relativeUrl = "/assets/products/" + productId + "/" + uniqueFilename;
            imagePaths.add(relativeUrl);

            ProductImage productImage = new ProductImage();
            productImage.setImageUrl(relativeUrl);
            productImage.setProduct(product);
            productImage.setOriginalFilename(originalFilename); // <- ahora este campo debe existir en la clase
            productImageRepository.save(productImage);
        }

        return imagePaths;
    }

    public String storeMainImage(Long productId, MultipartFile file) throws IOException {
        Path productDir = Paths.get(uploadDir, productId.toString());
        Files.createDirectories(productDir);

        String uniqueFilename = "main-" + UUID.randomUUID() + "-" + FilenameUtils.getName(file.getOriginalFilename());
        Path filePath = productDir.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/assets/products/" + productId + "/" + uniqueFilename;
    }
}