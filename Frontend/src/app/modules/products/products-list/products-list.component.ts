import { Component } from '@angular/core';
import { ProductService, Product } from '../../../core/services/product.service';


@Component({
  selector: 'app-products-list',
  imports: [],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent {
  products: Product[] = [];
  
    constructor(private productService: ProductService) {}
  
    ngOnInit(): void {
      this.productService.getProducts().subscribe(data => {
        this.products = data;
      });
    }
  

}
