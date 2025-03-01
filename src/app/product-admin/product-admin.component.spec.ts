import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAdminComponent } from './product-admin.component';

describe('ProductAdminComponent', () => {
    let component: ProductAdminComponent;
    let fixture: ComponentFixture<ProductAdminComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProductAdminComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ProductAdminComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
