package com.motionParts.ecommerce.services;

import com.motionParts.ecommerce.Models.Category;
import com.motionParts.ecommerce.dto.CategoryDTO;
import com.motionParts.ecommerce.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category saveCategory(CategoryDTO categoryDTO) {
    Category category = new Category();
    category.setName(categoryDTO.getName());
    category.setDescription(categoryDTO.getDescription());

    if (categoryDTO.getParentId() != null) {
        Category parent = categoryRepository.findById(categoryDTO.getParentId())
                .orElseThrow(() -> new RuntimeException("Parent category not found"));
        category.setParent(parent);
    }

    return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, CategoryDTO categoryDTO) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    
        existingCategory.setName(categoryDTO.getName());
        existingCategory.setDescription(categoryDTO.getDescription());
    
        if (categoryDTO.getParentId() != null) {
            Category parent = categoryRepository.findById(categoryDTO.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            existingCategory.setParent(parent);
        } else {
            existingCategory.setParent(null); // En caso de que se quiera convertir en categoría raíz
        }
    
        return categoryRepository.save(existingCategory);
    }    

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
