import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductCategory } from '../models/productCategory.model';
import { ProductCategoryDTO } from '../models/dto/product-category.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  private apiUrl = 'http://localhost:8080/api/product-category'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  // Obtener todas las relaciones producto-categoría
  getAllProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(this.apiUrl);
  }

  // Asignar una categoría a un producto
  assignCategoryToProduct(data: ProductCategoryDTO): Observable<ProductCategory> {
    return this.http.post<ProductCategory>(this.apiUrl, data);
  }


  // Obtener categorías por producto
  getCategoriesByProduct(productId: number): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.apiUrl}/categories/${productId}`);
  }

  getProductsByCategory(categoryId: number): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.apiUrl}/products/${categoryId}`);
  }

  // Eliminar una relación producto-categoría
  removeCategoryFromProduct(productCategoryId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productCategoryId}`);
  }
}
