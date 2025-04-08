// categories.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCategories',
  standalone: true
})
export class FilterCategoriesPipe implements PipeTransform {
  transform(categories: Category[], searchTerm: string): Category[] {
    if (!searchTerm) return categories;
    
    const term = searchTerm.toLowerCase();
    return categories.filter(category => 
      category.name.toLowerCase().includes(term) || 
      category.id?.toString().includes(term)
    );
  }
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterCategoriesPipe],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  expandedCategories: Set<number> = new Set();
  selectedCategory: Category | null = null;
  
  // Campos para nuevas categorías
  newCategoryName: string = '';
  newCategoryDescription: string = '';
  newSubcategoryName: string = '';
  
  // Búsqueda
  searchCategoryId: number | null = null;
  searchTerm: string = '';
  
  // Estado de UI
  activeTab: 'hierarchy' | 'all' = 'hierarchy';
  showSubcategoryForm: number | null = null;
  selectedCategoryToAssign: Category | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  // Métodos para filtrar categorías
  getRootCategories(): Category[] {
    return this.categories.filter(c => !c.parentId);
  }

  getSubcategories(parentId: number): Category[] {
    return this.categories.filter(c => c.parentId === parentId);
  }

  getAvailableCategoriesToAssign(parentId: number): Category[] {
    // Devuelve categorías que no son subcategorías de la categoría actual
    // y que no son la categoría actual (para evitar ciclos)
    return this.categories.filter(c => 
      c.id !== parentId && 
      c.parentId !== parentId &&
      !this.isDescendantOf(c.id!, parentId)
    );
  }

  getValidParentCategories(category: Category): Category[] {
    // Devuelve categorías que pueden ser padres de la categoría actual
    // (No puede ser la misma categoría ni alguno de sus descendientes)
    if (!category.id) return this.categories;
    
    return this.categories.filter(c => 
      c.id !== category.id && 
      !this.isDescendantOf(c.id!, category.id!)
    );
  }

  isDescendantOf(categoryId: number, ancestorId: number): boolean {
    // Verifica si categoryId es descendiente de ancestorId (para evitar ciclos)
    const category = this.categories.find(c => c.id === categoryId);
    if (!category || !category.parentId) return false;
    if (category.parentId === ancestorId) return true;
    return this.isDescendantOf(category.parentId, ancestorId);
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Desconocido';
  }

  // Métodos de UI
  setActiveTab(tab: 'hierarchy' | 'all'): void {
    this.activeTab = tab;
  }

  toggleExpandCategory(category: Category): void {
    if (!category.id) return;
    
    if (this.expandedCategories.has(category.id)) {
      this.expandedCategories.delete(category.id);
    } else {
      this.expandedCategories.add(category.id);
    }
  }

  isCategoryExpanded(category: Category): boolean {
    return category.id ? this.expandedCategories.has(category.id) : false;
  }

  toggleSubcategoryForm(category: Category): void {
    if (!category.id) return;
    
    this.showSubcategoryForm = this.showSubcategoryForm === category.id ? null : category.id;
    // Limpiar el formulario cuando se cierra
    if (this.showSubcategoryForm === null) {
      this.newSubcategoryName = '';
      this.selectedCategoryToAssign = null;
    }
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    
    // Si la categoría tiene un padre, asegurarse de que esté expandida
    if (category.parentId) {
      this.expandedCategories.add(category.parentId);
    }
    
    // Si la categoría es principal, expandirla
    if (category.id && !category.parentId) {
      this.expandedCategories.add(category.id);
    }
  }

  clearSelection(): void {
    this.selectedCategory = null;
  }

  // Métodos CRUD
  addCategory(): void {
    if (!this.newCategoryName.trim()) return;

    const categoryToSave: Category = {
      name: this.newCategoryName,
      description: this.newCategoryDescription,
      parentId: undefined
    };

    this.categoryService.createCategory(categoryToSave).subscribe(() => {
      this.newCategoryName = '';
      this.newCategoryDescription = '';
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
      this.showSubcategoryForm = null;
      this.loadCategories();
    });
  }

  assignExistingAsSubcategory(parentId: number): void {
    if (!this.selectedCategoryToAssign) return;
    
    const categoryToUpdate = { ...this.selectedCategoryToAssign };
    categoryToUpdate.parentId = parentId;
    
    this.categoryService.updateCategory(categoryToUpdate).subscribe(() => {
      this.selectedCategoryToAssign = null;
      this.showSubcategoryForm = null;
      this.loadCategories();
    });
  }

  unassignSubcategory(subcategoryId: number): void {
    const subcategory = this.categories.find(c => c.id === subcategoryId);
    if (!subcategory) return;
    
    const updatedSubcategory = { ...subcategory };
    updatedSubcategory.parentId = undefined;
    
    this.categoryService.updateCategory(updatedSubcategory).subscribe(() => {
      this.loadCategories();
    });
  }

  updateCategory(): void {
    if (!this.selectedCategory) return;
    
    this.categoryService.updateCategory(this.selectedCategory).subscribe(() => {
      this.clearSelection();
      this.loadCategories();
    });
  }

  deleteCategory(categoryId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.categoryService.deleteCategory(categoryId).subscribe(() => {
        if (this.selectedCategory?.id === categoryId) {
          this.clearSelection();
        }
        this.loadCategories();
      });
    }
  }

  findCategoryById(): void {
    if (!this.searchCategoryId) return;

    const found = this.categories.find(c => c.id === this.searchCategoryId);
    if (found) {
      this.selectCategory(found);
      // Cambiar a la pestaña de jerarquía
      this.activeTab = 'hierarchy';
    } else {
      alert('Categoría no encontrada');
    }
  }
}