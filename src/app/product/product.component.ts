import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CartService } from '../shopping-cart/shopping-cart.services';
import { ProductService } from "../services/product.service";
import { ApiResponse, Product } from "../types";

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
    product: Product | null = null;
    quantity: number = 1;
    productId: number | null = null;
    loading: boolean = true;
    error: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService
    ) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const productIdParam = params.get('productId');
            console.log('Route Parameter ProductId:', productIdParam);

            if (productIdParam) {
                this.productId = Number(productIdParam);
                this.fetchProductDetails(this.productId);
            } else {
                this.error = 'No product ID provided';
                this.loading = false;
                console.error('No product ID in route');
            }
        });
    }

    fetchProductDetails(productId: number): void {
        this.loading = true;
        this.productService.getProductById(productId.toString()).subscribe({
            next: (response: ApiResponse<Product>) => {
                console.log('Fetched Product Details:', response);
                this.product = response.data;

                this.loading = false;
            },
            error: (err) => {
                console.error('Error Fetching Product:', err);
                this.error = 'Failed to load product details';
                this.loading = false;
            },
        });
    }

    decreaseQuantity(): void {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    increaseQuantity(): void {
        if (this.product && this.quantity < this.product.productQuantity
        ) {
            this.quantity++;
        }
    }

    addToCart(): void {
        if (this.product) {
            const cart = this.cartService.getCartFromSessionStorage();
            this.cartService.addToCart(this.product, this.quantity, this.quantity, cart.cartId).subscribe({
                next: (cartItem) => {
                    console.log('Added to cart:', cartItem);
                },
                error: (err) => {
                    console.error('Failed to add to cart:', err);
                }
            });
        }
    }

}
