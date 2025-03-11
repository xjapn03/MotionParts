import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product as ProductModel } from '../models/product.model'; // Renombrado

export interface Product {
  id: number;
  name: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductModel[]> { // Cambiado a ProductModel[]
    return this.http.get<ProductModel[]>(this.apiUrl);
  }
}
