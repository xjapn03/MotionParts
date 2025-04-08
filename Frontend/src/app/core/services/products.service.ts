import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  // Obtener un producto por su ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  // Crear un nuevo producto
  createProduct(product: Product): Observable<Product> {
    // Asegúrate de que solo se envíen los IDs de las categorías
    const productToSend = { 
      ...product,
      categories: product.categories?.map(category => ({ id: category.id })) ?? []  // Solo envía los IDs
    };

    return this.http.post<Product>(this.apiUrl, productToSend).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un producto existente
  updateProduct(product: Product): Observable<Product> {
    // Asegúrate de que solo se envíen los IDs de las categorías
    const productToSend = { 
      ...product,
      categories: product.categories?.map(category => ({ id: category.id })) ?? []  // Solo envía los IDs
    };

    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, productToSend).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un producto
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  uploadMainImage(productId: number, formData: FormData): Observable<{ imageUrl: string }> {
    return this.http.post<{ imageUrl: string }>(
      `${this.apiUrl}/${productId}/upload-main-image`,
      formData
    );
  }       

  uploadImages(productId: number, files: File[]): Observable<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file)); // 👈 Nombre correcto: 'images'
  
    // Opcional: para debug de contenido del FormData
    for (const [key, value] of formData.entries()) {
      console.log(`[GALLERY] FormData campo: ${key}`, value);
    }
  
    return this.http.post<string[]>(
      `${this.apiUrl}/${productId}/upload-images`,
      formData
    ).pipe(
      catchError(this.handleError)
    );
  }    

  uploadGalleryImages(productId: number, images: File[]): Observable<any> {
    const formData = new FormData();
    images.forEach(image => formData.append('images', image));
  
    return this.http.post(`${this.apiUrl}/${productId}/upload-images`, formData);
  }  

  // Función de manejo de errores
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
