import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Env, Product } from "../types";

interface CartItem {
    cartItemId: number;
    productId: number;
    product: Product;
    quantity: number;
    price: number;
    cartId: number;
}

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
    cartItems$ = this.cartItemsSubject.asObservable();
    private env = environment as Env;
    private apiUrl = this.env.cartApi

    constructor(private http: HttpClient) {
    }

    addToCart(product: Product, quantity: number = 1): void {
        const currentCart = this.cartItemsSubject.value;

        const existingItemIndex = currentCart.findIndex(
            (item) => item.productId === product.productId
        );

        if (existingItemIndex > -1) {
            // Update quantity if the product already exists in the cart
            const updatedCart = [...currentCart];
            updatedCart[existingItemIndex] = {
                ...updatedCart[existingItemIndex],
                quantity: updatedCart[existingItemIndex].quantity + quantity,
            };
            this.cartItemsSubject.next(updatedCart);
        } else {
            // Add a new item to the cart
            this.cartItemsSubject.next([
                ...currentCart,
                {
                    cartItemId: Date.now(),
                    productId: product.productId,
                    product,
                    quantity,
                    price: product.productPrice,
                    cartId: 1, // Assuming a default cartId for simplicity
                },
            ]);
        }
    }

    removeFromCart(productId: number, quantityToRemove: number = 1): void {
        const currentCart = this.cartItemsSubject.value;

        const existingItemIndex = currentCart.findIndex(
            (item) => item.productId === productId
        );

        if (existingItemIndex > -1) {
            const updatedCart = [...currentCart];
            const item = updatedCart[existingItemIndex];

            if (item.quantity > quantityToRemove) {
                updatedCart[existingItemIndex] = {
                    ...item,
                    quantity: item.quantity - quantityToRemove,
                };
            } else {
                updatedCart.splice(existingItemIndex, 1); // Remove item if quantity becomes zero or less
            }

            this.cartItemsSubject.next(updatedCart);
        }
    }

    getCartItemCount(): number {
        return this.cartItemsSubject.value.reduce(
            (total, item) => total + item.quantity,
            0
        );
    }

    getCartItems(): CartItem[] {
        return this.cartItemsSubject.value;
    }

    clearCart(): void {
        this.cartItemsSubject.next([]);
    }

    sendCartToBackend(): Observable<any> {
        const cartItems = this.cartItemsSubject.value;
        const payload = cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
        }));

        return this.http.post(`${this.apiUrl}/cart`, payload);
    }
}
