import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../shopping-cart/shopping-cart.services';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
    cartItemCount: number = 0;
    isLoggedIn: boolean = false;
    showProfileDropdown: boolean = false;

    constructor(private cartService: CartService, private router: Router, private authService: AuthService) {
        this.isLoggedIn = this.authService.isLoggedIn();
    }

    isAdmin(): boolean {
        return sessionStorage.getItem('ROLE') === 'ADMINISTRATOR';
    }

    logOut(): void {
        console.log('Logged out');
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/']);
        window.location.reload();
    }

    navigateToCart(): void {
        if (this.isLoggedIn) {
            if (this.cartItemCount > 0) {
                
                this.router.navigate(['/shopping-cart']);
            } else {
             
                this.router.navigate(['/cart']);
            }
        } else {
           
            this.router.navigate(['auth/login']);
        }
    }
    
    ngOnInit(): void {
        this.cartService.cartItems$.subscribe(() => {
             this.cartItemCount = this.cartService.getCartItemCount();
        });
    }

    toggleProfileDropdown() {
        this.showProfileDropdown = !this.showProfileDropdown;
    }

}