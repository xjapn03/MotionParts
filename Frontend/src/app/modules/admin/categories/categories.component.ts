import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Category {
  id: number;
  name: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: number;
  name: string;
}

@Component({
  selector: 'app-categories',
  imports: [FormsModule,CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  newCategoryName: string = '';
  newSubcategoryName: string = '';
  searchCategoryId: string = ''; // Nueva variable para buscar por ID

  // Método para agregar una nueva categoría con un ID único
  addCategory() {
    const newCategory: Category = {
      id: this.generateUniqueId(this.categories), // Genera un ID único
      name: this.newCategoryName,
      subcategories: [],
    };
    this.categories.push(newCategory);
    this.newCategoryName = ''; // Limpiar el campo
  }

  addSubcategory(categoryId: number) {
    const category = this.categories.find(c => c.id === categoryId);
    if (category && this.newSubcategoryName) {
      const newSubcategory: Subcategory = {
        id: this.generateUniqueId(category.subcategories),
        name: this.newSubcategoryName,
      };
      category.subcategories.push(newSubcategory);
      this.newSubcategoryName = ''; // Limpiar el campo
    }
  }
  

  // Método para eliminar una categoría
  deleteCategory(category: Category) {
    this.categories = this.categories.filter(c => c.id !== category.id);
    if (this.selectedCategory === category) {
      this.selectedCategory = null;
    }
  }

  // Método para eliminar una subcategoría
  deleteSubcategory(subcategory: Subcategory) {
    if (this.selectedCategory) {
      this.selectedCategory.subcategories = this.selectedCategory.subcategories.filter(
        s => s.id !== subcategory.id
      );
    }
  }

  // Método para seleccionar una categoría
  selectCategory(category: Category) {
    this.selectedCategory = category;
  }

  // Método para buscar una categoría por ID
  findCategoryById() {
    const foundCategory = this.categories.find(cat => cat.id === Number(this.searchCategoryId));
    if (foundCategory) {
      this.selectedCategory = foundCategory;
    } else {
      alert('Categoría no encontrada');
    }
  }

  // Método para asignar una subcategoría existente a otra categoría
  assignSubcategoryToCategory(subcategoryId: number) {
    if (!this.selectedCategory) return;

    // Buscar la subcategoría en la categoría actual
    const subcategory = this.selectedCategory.subcategories.find(sub => sub.id === subcategoryId);
    if (!subcategory) return;

    const categoryId = prompt('Ingrese el ID de la categoría a la que desea asignar la subcategoría:');
    if (!categoryId) return;

    const newCategory = this.categories.find(cat => cat.id === Number(categoryId));
    if (newCategory && !newCategory.subcategories.some(sub => sub.id === subcategory.id)) {
      newCategory.subcategories.push({ ...subcategory });
      alert(`Subcategoría asignada a la categoría ${newCategory.name}`);
    } else {
      alert('Categoría no encontrada o la subcategoría ya existe en esa categoría.');
    }
  }

  // Método para generar un ID único para categorías o subcategorías
  private generateUniqueId<T extends { id: number }>(list: T[]): number {
    return list.length > 0 ? Math.max(...list.map(item => item.id)) + 1 : 1;
  }
}
