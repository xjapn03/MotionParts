package com.motionParts.ecommerce.services;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ImageStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public List<String> storeImages(Long productId, MultipartFile[] files) throws IOException {
        Path productDir = Paths.get(uploadDir, productId.toString());
        Files.createDirectories(productDir);

        List<String> imagePaths = new ArrayList<>();

        for (MultipartFile file : files) {
            String filename = UUID.randomUUID() + "-" + file.getOriginalFilename();
            Path targetPath = productDir.resolve(filename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String relativeUrl = "/assets/products/" + productId + "/" + filename;
            imagePaths.add(relativeUrl);
        }

        return imagePaths;
    }

    public String storeMainImage(Long productId, MultipartFile file) throws IOException {
        Path productDir = Paths.get(uploadDir, productId.toString());
        Files.createDirectories(productDir);
    
        // Usamos un nombre fijo para identificar que es la imagen principal
        String filename = "main-" + UUID.randomUUID() + "-" + file.getOriginalFilename();
        Path targetPath = productDir.resolve(filename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
    
        // Devuelve la ruta relativa (la que usarás en image_url)
        return "/assets/products/" + productId + "/" + filename;
    }
    
}