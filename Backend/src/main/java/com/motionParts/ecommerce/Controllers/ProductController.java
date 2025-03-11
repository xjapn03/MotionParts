package com.motionParts.ecommerce.Controllers;

import com.motionParts.ecommerce.Models.Product;
import com.motionParts.ecommerce.services.ProductService; // <-- IMPORTANTE
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService; // Inyección de dependencia

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
}
