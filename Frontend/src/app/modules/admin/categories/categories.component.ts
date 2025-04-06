import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  newCategory: Category = {
    name: '',
    description: '',
    parentId: undefined
  };

  newCategoryName: string = '';
  newSubcategoryName: string = '';
  searchCategoryId: number | null = null;
  selectedCategory: Category | null = null;
  selectedParentId: number | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  getRootCategories(): Category[] {
    return this.categories.filter(c => !c.parentId);
  }

  getSubcategories(parentId: number): Category[] {
    return this.categories.filter(c => c.parentId === parentId);
  }

  createCategory(): void {
    if (!this.newCategory.name.trim()) return;

    const categoryToSave: Category = {
      name: this.newCategory.name,
      description: this.newCategory.description,
      parentId: this.selectedParentId ?? undefined
    };

    this.categoryService.createCategory(categoryToSave).subscribe(() => {
      this.newCategory = {
        name: '',
        description: '',
        parentId: undefined
      };
      this.selectedParentId = null;
      this.loadCategories();
    });
  }

  deleteCategory(categoryId: number): void {
    this.categoryService.deleteCategory(categoryId).subscribe(() => {
      this.loadCategories();
    });
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
  }

  addCategory(): void {
    if (!this.newCategoryName.trim()) return;

    const categoryToSave: Category = {
      name: this.newCategoryName,
      description: '',
      parentId: undefined
    };

    this.categoryService.createCategory(categoryToSave).subscribe(() => {
      this.newCategoryName = '';
      this.loadCategories();
    });
  }

  addSubcategory(parentId: number): void {
    if (!this.newSubcategoryName.trim()) return;

    const subcategory: Category = {
      name: this.newSubcategoryName,
      description: '',
      parentId: parentId
    };

    this.categoryService.createCategory(subcategory).subscribe(() => {
      this.newSubcategoryName = '';
      this.loadCategories();
    });
  }

  assignSubcategoryToCategory(subcategoryId: number): void {
    if (!this.selectedCategory) return;

    const subcategory = this.categories.find(c => c.id === subcategoryId);
    if (subcategory) {
      subcategory.parentId = this.selectedCategory.id!;
      this.categoryService.updateCategory(subcategory).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  findCategoryById(): void {
    if (!this.searchCategoryId) return;

    const found = this.categories.find(c => c.id === this.searchCategoryId);
    if (found) {
      this.selectCategory(found);
    }
  }
}