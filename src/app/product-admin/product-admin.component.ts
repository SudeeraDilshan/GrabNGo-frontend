import { Component } from '@angular/core';
import { ProductDeleteComponent } from '../product-crud/product-delete/product-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { ApiResponse, Category, Product } from "../types";

@Component({
  selector: 'app-product-admin',
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.css'],
})
export class ProductAdminComponent {
  displayedColumns: string[] = [
    'Product Name',
    'Category',
    'Price',
    'Availability',
    'Action',
  ];
  products: Product[] = [];
  categories: Category[] = [];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = (products as unknown as ApiResponse<Product[]>).data;
        console.log('Updated productsss:', this.products);
      },
      error: (err) => {
        console.error('Error fetching updated products:', err);
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = (
          categories as unknown as ApiResponse<Category[]>
        ).data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      },
    });
  }

  addProduct() {
    this.router.navigate(['/productAdd']);
  }

  editProduct(product: any) {
    this.router.navigate(['/productEdit', product.productId]);
  }
  
  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ProductDeleteComponent);
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.productService.deleteProductByQuery(product.productId.toString()).subscribe({
          next: (response) => {
            console.log('Product deleted:', response.msg);
            this.loadProducts(); // Reload the product list
          },
          error: (err) => {
            console.error('Error deleting product:', err);
          },
        });
      }
    });
  }
  

  updateCategory(product: Product): void {
    this.productService
      .updateProduct(product.productId, { categoryId: product.categoryId })
      .subscribe({
        next: () => {
          console.log('Category updated:', product);
          this.loadProducts();
        },
        error: (err) => console.error('Error updating category:', err),
      });
  }

  updateAvailability(product: Product): void {
    this.productService
      .updateProduct(product.productId, { available: product.available })
      .subscribe({
        next: () => {
          console.log('Availability updated:', product);
          const index = this.products.findIndex(
            (p) => p.productId === product.productId
          );
          if (index !== -1) {
            this.products[index].available = product.available;
          }
        },
        error: (err) => console.error('Error updating availability:', err),
      });
  }
}